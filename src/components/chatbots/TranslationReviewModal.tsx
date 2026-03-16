'use client';

import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Languages, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PreChatFormConfig, PostChatSurveyConfig, PreChatFormField, SurveyQuestion } from '@/lib/chatbots/types';
import {
  DEFAULT_PRE_CHAT_FORM_CONFIG,
  DEFAULT_POST_CHAT_SURVEY_CONFIG,
} from '@/lib/chatbots/types';
import { getLanguageName } from '@/lib/chatbots/translations';

interface TranslationItem {
  id: string;
  type: 'title' | 'description' | 'button' | 'thankYou' | 'fieldLabel' | 'fieldPlaceholder' | 'fieldOption' | 'questionLabel' | 'questionOption';
  fieldId?: string;
  optionIndex?: number;
  original: string;
  translated: string;
  label: string;
}

interface GeneralText {
  welcomeMessage?: string;
  placeholderText?: string;
}

interface TranslationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (preChatConfig?: PreChatFormConfig, postChatConfig?: PostChatSurveyConfig, generalText?: GeneralText) => void;
  preChatConfig?: PreChatFormConfig;
  postChatConfig?: PostChatSurveyConfig;
  generalText?: GeneralText;
  targetLanguage: string;
  chatbotId: string;
  onSave?: () => Promise<void>;
}

export function TranslationReviewModal({
  isOpen,
  onClose,
  onApply,
  preChatConfig,
  postChatConfig,
  generalText,
  targetLanguage,
  chatbotId,
  onSave,
}: TranslationReviewModalProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetLanguageName = getLanguageName(targetLanguage);

  // Build translation items from configs
  const buildTranslationItems = (
    preChat?: PreChatFormConfig,
    postChat?: PostChatSurveyConfig,
    general?: GeneralText
  ): TranslationItem[] => {
    const items: TranslationItem[] = [];

    // General text items
    if (general) {
      if (general.welcomeMessage?.trim()) {
        items.push({
          id: 'general-welcomeMessage',
          type: 'description',
          original: general.welcomeMessage,
          translated: '',
          label: 'Welcome Message',
        });
      }
      if (general.placeholderText?.trim()) {
        items.push({
          id: 'general-placeholderText',
          type: 'description',
          original: general.placeholderText,
          translated: '',
          label: 'Input Placeholder',
        });
      }
    }

    if (preChat?.enabled) {
      // Title - include if not empty
      if (preChat.title?.trim()) {
        items.push({
          id: 'preChat-title',
          type: 'title',
          original: preChat.title,
          translated: '',
          label: 'Form Title',
        });
      }

      // Description - include if not empty
      if (preChat.description?.trim()) {
        items.push({
          id: 'preChat-description',
          type: 'description',
          original: preChat.description,
          translated: '',
          label: 'Form Description',
        });
      }

      // Submit Button - include if not empty
      if (preChat.submitButtonText?.trim()) {
        items.push({
          id: 'preChat-button',
          type: 'button',
          original: preChat.submitButtonText,
          translated: '',
          label: 'Submit Button',
        });
      }

      // Fields - include all field labels and placeholders
      preChat.fields.forEach((field) => {
        // Field label - always include
        items.push({
          id: `preChat-field-${field.id}-label`,
          type: 'fieldLabel',
          fieldId: field.id,
          original: field.label,
          translated: '',
          label: `Field: ${field.label}`,
        });

        // Field placeholder - include if exists
        if (field.placeholder?.trim()) {
          items.push({
            id: `preChat-field-${field.id}-placeholder`,
            type: 'fieldPlaceholder',
            fieldId: field.id,
            original: field.placeholder,
            translated: '',
            label: `Placeholder: ${field.label}`,
          });
        }

        // Select options - include all
        if (field.options?.length) {
          field.options.forEach((opt, optIndex) => {
            items.push({
              id: `preChat-field-${field.id}-option-${optIndex}`,
              type: 'fieldOption',
              fieldId: field.id,
              optionIndex: optIndex,
              original: opt,
              translated: '',
              label: `Option: ${opt}`,
            });
          });
        }
      });
    }

    if (postChat?.enabled) {
      // Title - include if not empty
      if (postChat.title?.trim()) {
        items.push({
          id: 'postChat-title',
          type: 'title',
          original: postChat.title,
          translated: '',
          label: 'Survey Title',
        });
      }

      // Description - include if not empty
      if (postChat.description?.trim()) {
        items.push({
          id: 'postChat-description',
          type: 'description',
          original: postChat.description,
          translated: '',
          label: 'Survey Description',
        });
      }

      // Submit Button - include if not empty
      if (postChat.submitButtonText?.trim()) {
        items.push({
          id: 'postChat-button',
          type: 'button',
          original: postChat.submitButtonText,
          translated: '',
          label: 'Submit Button',
        });
      }

      // Thank You Message - include if not empty
      if (postChat.thankYouMessage?.trim()) {
        items.push({
          id: 'postChat-thankYou',
          type: 'thankYou',
          original: postChat.thankYouMessage,
          translated: '',
          label: 'Thank You Message',
        });
      }

      // Questions - include all question labels and options
      postChat.questions.forEach((question) => {
        // Question label - always include
        items.push({
          id: `postChat-question-${question.id}-label`,
          type: 'questionLabel',
          fieldId: question.id,
          original: question.label,
          translated: '',
          label: `Question: ${question.label}`,
        });

        // Choice options - include all
        if (question.options?.length) {
          question.options.forEach((opt, optIndex) => {
            items.push({
              id: `postChat-question-${question.id}-option-${optIndex}`,
              type: 'questionOption',
              fieldId: question.id,
              optionIndex: optIndex,
              original: opt,
              translated: '',
              label: `Option: ${opt}`,
            });
          });
        }
      });
    }

    return items;
  };

  // Fetch translations when modal opens
  const handleOpen = async () => {
    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch(`/api/chatbots/${chatbotId}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage,
          preChatFormConfig: preChatConfig,
          postChatSurveyConfig: postChatConfig,
          generalText: generalText,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Translation failed');
      }

      const data = await response.json();

      // Build translation items with translated values
      const items = buildTranslationItems(preChatConfig, postChatConfig, generalText);

      // Apply general text translations
      if (data.data.generalText) {
        const translatedGeneral = data.data.generalText as GeneralText;
        items.forEach((item) => {
          if (item.id === 'general-welcomeMessage') item.translated = translatedGeneral.welcomeMessage || '';
          if (item.id === 'general-placeholderText') item.translated = translatedGeneral.placeholderText || '';
        });
      }

      // Apply translated values from API response
      if (data.data.preChatFormConfig) {
        const translatedPreChat = data.data.preChatFormConfig as PreChatFormConfig;

        items.forEach((item) => {
          if (item.id === 'preChat-title') item.translated = translatedPreChat.title;
          if (item.id === 'preChat-description') item.translated = translatedPreChat.description;
          if (item.id === 'preChat-button') item.translated = translatedPreChat.submitButtonText;

          // Field translations
          const fieldMatch = item.id.match(/preChat-field-([^-]+)-(label|placeholder|option-(\d+))/);
          if (fieldMatch) {
            const fieldId = fieldMatch[1];
            const fieldType = fieldMatch[2];
            const field = translatedPreChat.fields.find((f) => f.id === fieldId);
            if (field) {
              if (fieldType === 'label') item.translated = field.label;
              if (fieldType === 'placeholder') item.translated = field.placeholder || '';
              if (fieldType.startsWith('option-')) {
                const optIndex = parseInt(fieldMatch[3]);
                item.translated = field.options?.[optIndex] || '';
              }
            }
          }
        });
      }

      if (data.data.postChatSurveyConfig) {
        const translatedPostChat = data.data.postChatSurveyConfig as PostChatSurveyConfig;

        items.forEach((item) => {
          if (item.id === 'postChat-title') item.translated = translatedPostChat.title;
          if (item.id === 'postChat-description') item.translated = translatedPostChat.description;
          if (item.id === 'postChat-button') item.translated = translatedPostChat.submitButtonText;
          if (item.id === 'postChat-thankYou') item.translated = translatedPostChat.thankYouMessage;

          // Question translations
          const questionMatch = item.id.match(/postChat-question-([^-]+)-(label|option-(\d+))/);
          if (questionMatch) {
            const questionId = questionMatch[1];
            const questionType = questionMatch[2];
            const question = translatedPostChat.questions.find((q) => q.id === questionId);
            if (question) {
              if (questionType === 'label') item.translated = question.label;
              if (questionType.startsWith('option-')) {
                const optIndex = parseInt(questionMatch[3]);
                item.translated = question.options?.[optIndex] || '';
              }
            }
          }
        });
      }

      setTranslations(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  // Update a translation
  const updateTranslation = (id: string, newValue: string) => {
    setTranslations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, translated: newValue } : item))
    );
  };

  // Apply translations back to configs
  const handleApply = async () => {
    let newPreChat = preChatConfig ? { ...preChatConfig } : undefined;
    let newPostChat = postChatConfig ? { ...postChatConfig } : undefined;
    let newGeneral: GeneralText | undefined = generalText ? { ...generalText } : undefined;

    // Apply general text translations
    if (newGeneral) {
      translations.forEach((item) => {
        if (item.id === 'general-welcomeMessage') {
          newGeneral!.welcomeMessage = item.translated;
        }
        if (item.id === 'general-placeholderText') {
          newGeneral!.placeholderText = item.translated;
        }
      });
    }

    if (newPreChat?.enabled) {
      translations.forEach((item) => {
        switch (item.id) {
          case 'preChat-title':
            newPreChat!.title = item.translated;
            break;
          case 'preChat-description':
            newPreChat!.description = item.translated;
            break;
          case 'preChat-button':
            newPreChat!.submitButtonText = item.translated;
            break;
        }

        // Field updates
        const fieldMatch = item.id.match(/preChat-field-([^-]+)-(label|placeholder|option-(\d+))/);
        if (fieldMatch && item.fieldId) {
          const fieldId = item.fieldId;
          const fieldType = fieldMatch[2];
          const field = newPreChat!.fields.find((f) => f.id === fieldId);
          if (field) {
            if (fieldType === 'label') field.label = item.translated;
            if (fieldType === 'placeholder') field.placeholder = item.translated;
            if (fieldType.startsWith('option-') && field.options && item.optionIndex !== undefined) {
              field.options[item.optionIndex] = item.translated;
            }
          }
        }
      });
    }

    if (newPostChat?.enabled) {
      translations.forEach((item) => {
        switch (item.id) {
          case 'postChat-title':
            newPostChat!.title = item.translated;
            break;
          case 'postChat-description':
            newPostChat!.description = item.translated;
            break;
          case 'postChat-button':
            newPostChat!.submitButtonText = item.translated;
            break;
          case 'postChat-thankYou':
            newPostChat!.thankYouMessage = item.translated;
            break;
        }

        // Question updates
        const questionMatch = item.id.match(/postChat-question-([^-]+)-(label|option-(\d+))/);
        if (questionMatch && item.fieldId) {
          const questionId = item.fieldId;
          const questionType = questionMatch[2];
          const question = newPostChat!.questions.find((q) => q.id === questionId);
          if (question) {
            if (questionType === 'label') question.label = item.translated;
            if (questionType.startsWith('option-') && question.options && item.optionIndex !== undefined) {
              question.options[item.optionIndex] = item.translated;
            }
          }
        }
      });
    }

    onApply(newPreChat, newPostChat, newGeneral);

    // Auto-save if onSave is provided
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave();
      } catch (err) {
        console.error('Failed to save translations:', err);
      } finally {
        setIsSaving(false);
      }
    }

    onClose();
  };

  // Count items ready to translate
  const hasItemsToTranslate = useMemo(() => {
    return buildTranslationItems(preChatConfig, postChatConfig).length > 0;
  }, [preChatConfig, postChatConfig]);

  // Trigger translation when modal opens
  useEffect(() => {
    if (isOpen) {
      setTranslations([]);
      handleOpen();
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-primary-500" />
            Translate to {targetLanguageName}
          </DialogTitle>
          <DialogDescription>
            Review and edit the AI-translated text before applying. Placeholders like {'{{name}}'} will be preserved.
          </DialogDescription>
        </DialogHeader>

        {isTranslating ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-4" />
            <p className="text-secondary-600">Translating your custom text...</p>
            <p className="text-sm text-secondary-500 mt-2">This may take a few moments</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-4" />
            <p className="text-red-600 mb-2">Translation failed</p>
            <p className="text-sm text-secondary-500">{error}</p>
            <Button variant="outline" onClick={handleOpen} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : translations.length === 0 ? (
          <div className="py-8 text-center">
            <Check className="w-8 h-8 mx-auto text-green-500 mb-4" />
            <p className="text-secondary-900 dark:text-secondary-100 font-medium">
              Nothing to translate
            </p>
            <p className="text-sm text-secondary-500 mt-2">
              Your form and survey text already matches the default {targetLanguageName} translations.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="text-sm text-secondary-500 mb-4">
              Found <strong>{translations.length}</strong> custom text field(s) to translate
            </div>

            {translations.map((item) => (
              <div
                key={item.id}
                className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                    {item.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-secondary-400" />
                </div>

                <div className="grid gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-secondary-500">Original</Label>
                    <div className="p-2 bg-secondary-50 dark:bg-secondary-800 rounded text-sm text-secondary-700 dark:text-secondary-300">
                      {item.original}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-secondary-500">Translation</Label>
                    <Input
                      value={item.translated}
                      onChange={(e) => updateTranslation(item.id, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {translations.length > 0 && !onSave && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> After applying translations, remember to click <strong>"Save Changes"</strong> at the bottom of the page to persist your changes.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 pt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {translations.length > 0 && (
            <Button onClick={handleApply} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Apply & Save
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Helper to check if there are custom text values that differ from defaults
 */
export function hasCustomText(
  preChatConfig?: PreChatFormConfig,
  postChatConfig?: PostChatSurveyConfig
): boolean {
  if (preChatConfig?.enabled) {
    if (preChatConfig.title !== DEFAULT_PRE_CHAT_FORM_CONFIG.title) return true;
    if (preChatConfig.description !== DEFAULT_PRE_CHAT_FORM_CONFIG.description) return true;
    if (preChatConfig.submitButtonText !== DEFAULT_PRE_CHAT_FORM_CONFIG.submitButtonText) return true;

    // Check fields
    for (const field of preChatConfig.fields) {
      const isDefaultField = DEFAULT_PRE_CHAT_FORM_CONFIG.fields.some(
        (f) => f.label === field.label && f.type === field.type
      );
      if (!isDefaultField) return true;
      if (field.placeholder) return true;
      if (field.options && field.options.length > 0) return true;
    }
  }

  if (postChatConfig?.enabled) {
    if (postChatConfig.title !== DEFAULT_POST_CHAT_SURVEY_CONFIG.title) return true;
    if (postChatConfig.description !== DEFAULT_POST_CHAT_SURVEY_CONFIG.description) return true;
    if (postChatConfig.submitButtonText !== DEFAULT_POST_CHAT_SURVEY_CONFIG.submitButtonText)
      return true;
    if (postChatConfig.thankYouMessage !== DEFAULT_POST_CHAT_SURVEY_CONFIG.thankYouMessage)
      return true;

    // Check questions
    for (const question of postChatConfig.questions) {
      const isDefaultQuestion = DEFAULT_POST_CHAT_SURVEY_CONFIG.questions.some(
        (q) => q.label === question.label
      );
      if (!isDefaultQuestion) return true;
      if (question.options && question.options.length > 0) return true;
    }
  }

  return false;
}
