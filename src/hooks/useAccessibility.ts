import { useEffect, useCallback } from 'react';

/**
 * Keyboard navigation hook for LookupSelect
 * Handles Ctrl+Enter confirm shortcut. Escape and Tab are handled by Modal.
 */
export function useKeyboardNavigation({
  isModalOpen,
  onConfirm,
}: {
  isModalOpen: boolean;
  onConfirm?: () => void;
  onRowSelect?: (row: any) => void;
  currentData: any[];
  selectedRows: any[];
  mode: 'single' | 'multiple';
}) {
  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (event.key) {
        case 'Enter':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onConfirm?.();
          }
          break;

        case 'ArrowDown':
        case 'ArrowUp': {
          // Navigate between grid rows
          const grid = document.querySelector(
            '.lookup-select__grid tbody, .lookup-select__virtual-grid-body'
          );
          if (!grid) break;

          const rows = grid.querySelectorAll(
            'tr[tabindex="0"], tr[role="row"]'
          );
          if (rows.length === 0) break;

          const currentIndex = Array.from(rows).findIndex(
            (row) => row === document.activeElement
          );

          let nextIndex: number;
          if (event.key === 'ArrowDown') {
            nextIndex =
              currentIndex < 0 ? 0 : Math.min(currentIndex + 1, rows.length - 1);
          } else {
            nextIndex =
              currentIndex < 0
                ? rows.length - 1
                : Math.max(currentIndex - 1, 0);
          }

          event.preventDefault();
          (rows[nextIndex] as HTMLElement)?.focus();
          break;
        }

        case 'Home': {
          const gridHome = document.querySelector(
            '.lookup-select__grid tbody, .lookup-select__virtual-grid-body'
          );
          if (!gridHome) break;
          const firstRow = gridHome.querySelector(
            'tr[tabindex="0"], tr[role="row"]'
          ) as HTMLElement;
          if (firstRow) {
            event.preventDefault();
            firstRow.focus();
          }
          break;
        }

        case 'End': {
          const gridEnd = document.querySelector(
            '.lookup-select__grid tbody, .lookup-select__virtual-grid-body'
          );
          if (!gridEnd) break;
          const allRows = gridEnd.querySelectorAll(
            'tr[tabindex="0"], tr[role="row"]'
          );
          const lastRow = allRows[allRows.length - 1] as HTMLElement;
          if (lastRow) {
            event.preventDefault();
            lastRow.focus();
          }
          break;
        }

        default:
          break;
      }
    },
    [isModalOpen, onConfirm]
  );

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isModalOpen, handleKeyDown]);

  return {
    handleKeyDown,
  };
}

/**
 * Focus management is handled by Modal component directly via modalRef.
 * This hook is kept as a no-op for backward compatibility.
 * @deprecated Use Modal component's built-in focus trap instead.
 */
export function useFocusManagement(_isOpen: boolean) {
  // Focus trap and initial focus are managed by Modal.tsx
  // which uses modalRef for reliable element targeting.
}

/**
 * Screen reader announcements hook
 * Provides live region announcements for state changes
 */
export function useScreenReaderAnnouncements() {
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only'; // Screen reader only class
      announcement.textContent = message;

      document.body.appendChild(announcement);

      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
    []
  );

  return { announce };
}
