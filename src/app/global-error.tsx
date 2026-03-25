'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('theme')==='dark'||(!localStorage.getItem('theme')&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}` }} />
      </head>
      <body>
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
          <div className="text-center max-w-lg">
            <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-8">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Critical Error
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              A critical error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            {error.digest && (
              <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
