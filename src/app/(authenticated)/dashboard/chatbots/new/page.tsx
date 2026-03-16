'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Bot, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { SYSTEM_PROMPT_TEMPLATES } from '@/lib/chatbots/types';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '@/lib/chatbots/translations';

const steps = [
  { id: 'basics', title: 'Basic Info', description: 'Name and describe your chatbot' },
  { id: 'prompt', title: 'System Prompt', description: 'Define how your chatbot behaves' },
  { id: 'review', title: 'Review', description: 'Review and create' },
];

interface FormData {
  name: string;
  description: string;
  system_prompt: string;
  welcome_message: string;
  enable_prompt_protection: boolean;
  language: string;
}

export default function NewChatbotPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    system_prompt: SYSTEM_PROMPT_TEMPLATES[0].prompt,
    welcome_message: 'Hi! How can I help you today?',
    enable_prompt_protection: true,
    language: 'en',
  });

  const updateField = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/chatbots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to create chatbot');
      }

      const data = await response.json();
      router.push(`/dashboard/chatbots/${data.data.chatbot.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim().length >= 1;
      case 1:
        return formData.system_prompt.trim().length >= 10;
      case 2:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/chatbots"
          className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Chatbots
        </Link>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Create New Chatbot
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Set up your AI chatbot in just a few steps
        </p>
      </div>

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  index < currentStep
                    ? 'bg-primary-500 text-white'
                    : index === currentStep
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 ring-2 ring-primary-500'
                    : 'bg-secondary-100 text-secondary-500 dark:bg-secondary-800 dark:text-secondary-400'
                )}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-24 h-0.5 mx-2',
                    index < currentStep
                      ? 'bg-primary-500'
                      : 'bg-secondary-200 dark:bg-secondary-700'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div key={step.id} className="text-center" style={{ width: '33%' }}>
              <p
                className={cn(
                  'text-sm font-medium',
                  index === currentStep
                    ? 'text-secondary-900 dark:text-secondary-100'
                    : 'text-secondary-500 dark:text-secondary-400'
                )}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <BasicInfoStep formData={formData} updateField={updateField} />
          )}
          {currentStep === 1 && (
            <SystemPromptStep formData={formData} updateField={updateField} />
          )}
          {currentStep === 2 && (
            <ReviewStep formData={formData} />
          )}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} disabled={!isStepValid()}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={loading || !isStepValid()}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-2" />
                Create Chatbot
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

interface StepProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: string | number | boolean) => void;
}

function BasicInfoStep({ formData, updateField }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Chatbot Name *</Label>
        <Input
          id="name"
          placeholder="My Support Bot"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          maxLength={100}
        />
        <p className="text-xs text-secondary-500">
          Give your chatbot a memorable name
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          placeholder="A helpful chatbot for answering customer questions..."
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="w-full min-h-[100px] px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
          maxLength={500}
        />
        <p className="text-xs text-secondary-500">
          Briefly describe what this chatbot does (optional)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="welcome_message">Welcome Message</Label>
        <Input
          id="welcome_message"
          placeholder="Hi! How can I help you today?"
          value={formData.welcome_message}
          onChange={(e) => updateField('welcome_message', e.target.value)}
          maxLength={500}
        />
        <p className="text-xs text-secondary-500">
          The first message visitors see when they open the chat
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <select
          id="language"
          value={formData.language}
          onChange={(e) => updateField('language', e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
        <p className="text-xs text-secondary-500">
          The language for widget UI and AI responses
        </p>
      </div>
    </div>
  );
}

function SystemPromptStep({ formData, updateField }: StepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (template: typeof SYSTEM_PROMPT_TEMPLATES[0]) => {
    setSelectedTemplate(template.id);
    updateField('system_prompt', template.prompt);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-3 block">Choose a Template</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SYSTEM_PROMPT_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={cn(
                'p-4 text-left rounded-lg border-2 transition-colors',
                selectedTemplate === template.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
              )}
            >
              <p className="font-medium text-secondary-900 dark:text-secondary-100">
                {template.name}
              </p>
              <p className="text-sm text-secondary-500 mt-1">
                {template.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="system_prompt">System Prompt *</Label>
        <textarea
          id="system_prompt"
          value={formData.system_prompt}
          onChange={(e) => updateField('system_prompt', e.target.value)}
          className="w-full min-h-[200px] px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm resize-y"
          style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
          placeholder="You are a helpful AI assistant..."
        />
        <p className="text-xs text-secondary-500">
          Instructions that define how your chatbot behaves. Be specific about tone, capabilities, and limitations.
        </p>
      </div>

      <div className="flex items-start space-x-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
        <input
          type="checkbox"
          id="enable_prompt_protection"
          checked={formData.enable_prompt_protection}
          onChange={(e) => updateField('enable_prompt_protection', e.target.checked)}
          className="mt-1 w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
        />
        <div className="flex-1">
          <Label htmlFor="enable_prompt_protection" className="cursor-pointer font-medium text-secondary-900 dark:text-secondary-100">
            Enable Prompt Injection Protection (Recommended)
          </Label>
          <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
            Automatically adds security rules to prevent users from manipulating the chatbot with prompt injection attacks. 
            Keeps your chatbot focused on its intended purpose and prevents it from being tricked into revealing instructions or behaving unexpectedly.
          </p>
        </div>
      </div>

    </div>
  );
}

function ReviewStep({ formData }: { formData: FormData }) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              {formData.name || 'Untitled Chatbot'}
            </h3>
            <p className="text-sm text-secondary-500">
              {formData.description || 'No description'}
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
          <div>
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Welcome Message
            </p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {formData.welcome_message}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Language
            </p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {(() => { const lang = getLanguageByCode(formData.language); return lang ? `${lang.nativeName} (${lang.name})` : 'English'; })()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              System Prompt
            </p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 whitespace-pre-wrap">
              {formData.system_prompt}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
        <h4 className="font-medium text-primary-700 dark:text-primary-300 mb-2">
          What happens next?
        </h4>
        <ul className="text-sm text-primary-600 dark:text-primary-400 space-y-1">
          <li>1. Your chatbot will be created in draft mode</li>
          <li>2. Add knowledge sources to train your chatbot</li>
          <li>3. Customize the widget appearance</li>
          <li>4. Publish and embed on your website</li>
        </ul>
      </div>
    </div>
  );
}
