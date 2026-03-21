'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PerformancePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function PerformancePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  loading,
}: PerformancePaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | 'ellipsis')[] = [1];
    if (currentPage > 3) pages.push('ellipsis');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t border-secondary-700">
      <p className="text-xs text-secondary-400">
        Showing <span className="font-medium text-secondary-200">{start}&ndash;{end}</span> of{' '}
        <span className="font-medium text-secondary-200">{totalItems.toLocaleString()}</span> requests
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-secondary-700 bg-secondary-800 text-secondary-300 transition-colors hover:bg-secondary-700 hover:text-secondary-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {getPageNumbers().map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-secondary-500">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={loading}
              className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'border border-secondary-700 bg-secondary-800 text-secondary-300 hover:bg-secondary-700 hover:text-secondary-100'
              } disabled:opacity-50`}
            >
              {page}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-secondary-700 bg-secondary-800 text-secondary-300 transition-colors hover:bg-secondary-700 hover:text-secondary-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
