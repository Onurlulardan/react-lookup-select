import React from 'react';

/**
 * Pagination bileşeni - server-side data için sayfalama
 * Project.md Faz 6: total, page senkronizasyonu
 */

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) {
    return null; // Don't show pagination if only 1 page
  }

  const getVisiblePages = () => {
    const delta = 2; // Show 2 pages on each side of current
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className={`lookup-select__pagination ${className || ''}`}>
      <div className="lookup-select__pagination-info">
        {totalCount > 0 ? (
          <>
            {startRecord}-{endRecord} / {totalCount} kayıt
          </>
        ) : (
          '0 kayıt'
        )}
      </div>

      <div className="lookup-select__pagination-controls">
        {/* Previous button */}
        <button
          type="button"
          className="lookup-select__pagination-button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Önceki sayfa"
        >
          ‹
        </button>

        {/* Page numbers */}
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="lookup-select__pagination-dots"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          return (
            <button
              key={pageNum}
              type="button"
              className={`
                lookup-select__pagination-button
                ${currentPage === pageNum ? 'lookup-select__pagination-button--active' : ''}
              `}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Sayfa ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next button */}
        <button
          type="button"
          className="lookup-select__pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Sonraki sayfa"
        >
          ›
        </button>
      </div>
    </div>
  );
}
