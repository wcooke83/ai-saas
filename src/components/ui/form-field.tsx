'use client';

import { useId, forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: string;
  hint?: string;
  showValidation?: boolean;
  validateOnBlur?: boolean;
  validator?: (value: string) => string | null;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      success,
      hint,
      showValidation = true,
      validateOnBlur = true,
      validator,
      className,
      onChange,
      onBlur,
      value,
      ...props
    },
    ref
  ) => {
    const id = useId();
    const [internalError, setInternalError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);

    const displayError = error || internalError;
    const hasError = touched && !!displayError;
    const hasSuccess = touched && success && !displayError;

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      if (validateOnBlur && validator) {
        const validationError = validator(e.target.value);
        setInternalError(validationError);
      }
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (touched && validator) {
        const validationError = validator(e.target.value);
        setInternalError(validationError);
      }
      onChange?.(e);
    };

    return (
      <div className={cn('space-y-2', className)}>
        <Label htmlFor={id} className="flex items-center gap-1">
          {label}
          {props.required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              hasError && 'border-red-500 focus-visible:ring-red-500',
              hasSuccess && 'border-green-500 focus-visible:ring-green-500',
              (hasError || hasSuccess) && 'pr-10'
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${id}-error` : hint ? `${id}-hint` : undefined
            }
            {...props}
          />
          {showValidation && (
            <AnimatePresence>
              {hasError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </motion.div>
              )}
              {hasSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        <AnimatePresence mode="wait">
          {hasError && (
            <motion.p
              id={`${id}-error`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-500 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-3 h-3" />
              {displayError}
            </motion.p>
          )}
          {hasSuccess && !hasError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-green-500 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              {success}
            </motion.p>
          )}
          {hint && !hasError && !hasSuccess && (
            <motion.p
              id={`${id}-hint`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-secondary-500 flex items-center gap-1"
            >
              <Info className="w-3 h-3" />
              {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FormField.displayName = 'FormField';

// Common validators
export const validators = {
  required: (message = 'This field is required') => (value: string) =>
    value.trim() ? null : message,

  email: (message = 'Please enter a valid email') => (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : message,

  minLength: (min: number, message?: string) => (value: string) =>
    value.length >= min ? null : message || `Must be at least ${min} characters`,

  maxLength: (max: number, message?: string) => (value: string) =>
    value.length <= max ? null : message || `Must be at most ${max} characters`,

  pattern: (regex: RegExp, message = 'Invalid format') => (value: string) =>
    regex.test(value) ? null : message,

  url: (message = 'Please enter a valid URL') => (value: string) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  },

  combine: (...validators: ((value: string) => string | null)[]) => (value: string) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  },
};

export { FormField };
