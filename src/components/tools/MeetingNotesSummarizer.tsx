'use client';

import { useState, useId, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Upload,
  Download,
  FileText,
  ChevronDown,
  User,
  CheckSquare,
  Info,
} from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  type MeetingType,
  type SummarySection,
  type MeetingSummary,
  type ActionItem,
  type Attendee,
  MEETING_TYPES,
  SECTION_CONFIG,
  ALL_SECTIONS,
  MEETING_TYPE_DEFAULTS,
  exportAsMarkdown,
  exportAsText,
} from '@/lib/ai/prompts/meeting-notes';

interface MeetingNotesSummarizerProps {
  className?: string;
  apiEndpoint?: string;
  apiKey?: string;
  onGenerate?: (result: MeetingSummary) => void;
}

export function MeetingNotesSummarizer({
  className,
  apiEndpoint = '/api/tools/meeting-notes',
  apiKey,
  onGenerate,
}: MeetingNotesSummarizerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<MeetingSummary | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [transcript, setTranscript] = useState('');
  const [meetingType, setMeetingType] = useState<MeetingType>('general');
  const [selectedSections, setSelectedSections] = useState<SummarySection[]>(
    MEETING_TYPE_DEFAULTS['general']
  );
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');

  // Generate unique IDs for form fields
  const formId = useId();
  const transcriptId = `${formId}-transcript`;
  const meetingTypeId = `${formId}-meeting-type`;
  const titleId = `${formId}-title`;
  const dateId = `${formId}-date`;
  const contextId = `${formId}-context`;

  // Handle meeting type change - update default sections
  const handleMeetingTypeChange = (type: MeetingType) => {
    setMeetingType(type);
    setSelectedSections(MEETING_TYPE_DEFAULTS[type]);
  };

  // Handle section toggle
  const toggleSection = (section: SummarySection) => {
    if (SECTION_CONFIG[section].required) return; // Can't toggle required sections

    setSelectedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  // Parse VTT/SRT file content
  const parseSubtitleFile = (content: string): string => {
    return content
      .replace(/^WEBVTT\s*/i, '') // Remove VTT header
      .replace(/\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[.,]\d{3}/g, '') // Remove timestamps
      .replace(/^\d+$/gm, '') // Remove SRT sequence numbers
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join('\n');
  };

  // Handle file upload
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const ext = file.name.toLowerCase().split('.').pop();

        if (ext === 'vtt' || ext === 'srt') {
          setTranscript(parseSubtitleFile(content));
        } else {
          setTranscript(content);
        }
      };
      reader.readAsText(file);

      // Reset input so same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    []
  );

  // Generate summary
  const handleGenerate = async () => {
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          transcript,
          meetingType,
          sections: selectedSections,
          meetingTitle: meetingTitle || undefined,
          meetingDate: meetingDate || undefined,
          additionalContext: additionalContext || undefined,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to generate summary');
      }

      setResult(data.data);
      onGenerate?.(data.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!result) return;
    const markdown = exportAsMarkdown(result);
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download handlers
  const downloadMarkdown = () => {
    if (!result) return;
    const content = exportAsMarkdown(result);
    downloadFile(content, `${sanitizeFilename(result.title)}.md`, 'text/markdown');
    setShowExportMenu(false);
  };

  const downloadText = () => {
    if (!result) return;
    const content = exportAsText(result);
    downloadFile(content, `${sanitizeFilename(result.title)}.txt`, 'text/plain');
    setShowExportMenu(false);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sanitizeFilename = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50);
  };

  const isFormValid = transcript.length >= 50;

  return (
    <div className={cn('grid gap-6 lg:grid-cols-2', className)}>
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Meeting Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Meeting Type */}
          <div className="space-y-2">
            <label
              htmlFor={meetingTypeId}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1"
            >
              Meeting Type
              <Tooltip content="Tailors the summary structure. Standups focus on status updates, Sales on next steps, Interviews on candidate evaluation.">
                <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
              </Tooltip>
            </label>
            <Select
              id={meetingTypeId}
              options={MEETING_TYPES}
              value={meetingType}
              onChange={(e) => handleMeetingTypeChange(e.target.value as MeetingType)}
            />
          </div>

          {/* Transcript */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor={transcriptId}
                className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1"
              >
                Transcript <span className="text-red-500">*</span>
                <Tooltip content="Paste raw text or upload a VTT/SRT subtitle file. Timestamps are automatically stripped from subtitle files.">
                  <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                </Tooltip>
              </label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.vtt,.srt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id={`${formId}-file`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <Upload className="h-4 w-4 mr-1" aria-hidden="true" />
                  Upload
                </Button>
              </div>
            </div>
            <Textarea
              id={transcriptId}
              placeholder="Paste your meeting transcript here, or upload a VTT/SRT file...

Example:
John: Good morning everyone. Let's start with the standup.
Sarah: Sure. Yesterday I completed the API integration.
John: Great. Any blockers?
Sarah: I need access to the staging environment."
              rows={10}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              aria-required="true"
              aria-describedby={`${transcriptId}-hint`}
            />
            <p id={`${transcriptId}-hint`} className="text-xs text-secondary-500 dark:text-secondary-400">
              {transcript.length.toLocaleString()} characters (min 50 required)
              {transcript.length > 0 && transcript.length < 50 && (
                <span className="text-amber-500"> - need {50 - transcript.length} more</span>
              )}
            </p>
          </div>

          {/* Sections to include */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1">
              Sections to Include
              <Tooltip content="Choose which sections appear in the summary. Summary is always included. Default sections change based on meeting type.">
                <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
              </Tooltip>
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {ALL_SECTIONS.map((section) => {
                const config = SECTION_CONFIG[section];
                const isSelected = selectedSections.includes(section);
                const isRequired = config.required;

                return (
                  <button
                    key={section}
                    type="button"
                    onClick={() => toggleSection(section)}
                    disabled={isRequired}
                    className={cn(
                      'flex items-start gap-2 p-2 rounded-md border text-left transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800',
                      isRequired && 'opacity-75 cursor-not-allowed'
                    )}
                    aria-pressed={isSelected}
                  >
                    <div
                      className={cn(
                        'mt-0.5 h-4 w-4 rounded border flex items-center justify-center flex-shrink-0',
                        isSelected
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'border-secondary-300 dark:border-secondary-600'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" aria-hidden="true" />}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {config.label}
                        {isRequired && (
                          <span className="ml-1 text-xs text-secondary-500">(required)</span>
                        )}
                      </span>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        {config.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor={titleId}
                className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Meeting Title
                <span className="ml-1 text-xs text-secondary-500 font-normal">(optional)</span>
              </label>
              <Input
                id={titleId}
                placeholder="Weekly Team Standup"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={dateId}
                className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Meeting Date
                <span className="ml-1 text-xs text-secondary-500 font-normal">(optional)</span>
              </label>
              <Input
                id={dateId}
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
              />
            </div>
          </div>

          {/* Additional context */}
          <div className="space-y-2">
            <label
              htmlFor={contextId}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1"
            >
              Additional Context
              <span className="text-xs text-secondary-500 font-normal">(optional)</span>
              <Tooltip content="Add project names, acronyms, or team context to help the AI produce more accurate summaries.">
                <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
              </Tooltip>
            </label>
            <Textarea
              id={contextId}
              placeholder="Any context that might help, e.g., project names, team members, or focus areas..."
              rows={2}
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!isFormValid || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Generating Summary...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                Generate Summary
              </>
            )}
          </Button>

        </CardContent>
      </Card>

      {/* Output */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-500" aria-hidden="true" />
              Meeting Summary
            </CardTitle>
            {result && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  aria-label="Regenerate summary"
                >
                  <RefreshCw
                    className={cn('h-4 w-4', isLoading && 'animate-spin')}
                    aria-hidden="true"
                  />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {result.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
                  <span>{result.date}</span>
                  <span>•</span>
                  <Badge variant="outline">
                    {MEETING_TYPES.find((t) => t.value === result.meetingType)?.label}
                  </Badge>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {result.sections.map((section, index) => (
                  <SectionDisplay key={index} section={section} />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-secondary-200 dark:border-secondary-700">
                <Button variant="outline" className="flex-1" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-green-500" aria-hidden="true" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                      Copy
                    </>
                  )}
                </Button>
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    aria-expanded={showExportMenu}
                    aria-haspopup="true"
                  >
                    <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                    Download
                    <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Button>
                  {showExportMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 z-10">
                      <div className="py-1">
                        <button
                          onClick={downloadMarkdown}
                          className="w-full px-4 py-2 text-sm text-left text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                        >
                          Download as Markdown
                        </button>
                        <button
                          onClick={downloadText}
                          className="w-full px-4 py-2 text-sm text-left text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                        >
                          Download as Text
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-secondary-500 dark:text-secondary-400">
              <MessageSquare className="mb-4 h-12 w-12" aria-hidden="true" />
              <p className="text-sm">
                Paste your meeting transcript and click Generate to create your summary
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Section display component
function SectionDisplay({
  section,
}: {
  section: { type: SummarySection; title: string; content: string; items?: ActionItem[] | Attendee[] };
}) {
  const getIcon = () => {
    switch (section.type) {
      case 'action-items':
        return <CheckSquare className="h-4 w-4" aria-hidden="true" />;
      case 'attendees':
        return <User className="h-4 w-4" aria-hidden="true" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
        {getIcon()}
        {section.title}
      </h4>
      <div className="text-sm text-secondary-700 dark:text-secondary-300 whitespace-pre-wrap rounded-md bg-secondary-50 dark:bg-secondary-800 p-3">
        {section.content}
      </div>

      {/* Structured action items */}
      {section.type === 'action-items' && section.items && (section.items as ActionItem[]).length > 0 && (
        <div className="space-y-1 pl-2">
          {(section.items as ActionItem[]).map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-sm text-secondary-700 dark:text-secondary-300"
            >
              <input type="checkbox" className="mt-1 rounded" disabled />
              <div>
                <span>{item.task}</span>
                {item.owner && (
                  <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">
                    @{item.owner}
                  </span>
                )}
                {item.deadline && (
                  <span className="ml-2 text-xs text-secondary-500">Due: {item.deadline}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Structured attendees */}
      {section.type === 'attendees' && section.items && (section.items as Attendee[]).length > 0 && (
        <div className="flex flex-wrap gap-2 pl-2">
          {(section.items as Attendee[]).map((item, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {item.name}
              {item.role && <span className="ml-1 opacity-70">({item.role})</span>}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
