import { useEffect, useCallback } from 'react';

/**
 * Keyboard navigation hook for LookupSelect
 * Handles Enter, Escape, Arrow keys, Tab navigation
 */
export function useKeyboardNavigation({
  isModalOpen,
  onClose,
  onConfirm,
  onRowSelect,
  currentData,
  selectedRows,
  mode,
}: {
  isModalOpen: boolean;
  onClose: () => void;
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
        case 'Escape':
          event.preventDefault();
          onClose();
          break;

        case 'Enter':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onConfirm?.();
          }
          break;

        case 'ArrowDown':
        case 'ArrowUp':
          // Grid navigation handled by Grid component
          break;

        default:
          break;
      }
    },
    [isModalOpen, onClose, onConfirm]
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
 * Focus management hook for accessibility
 * Manages focus trap and initial focus
 */
export function useFocusManagement(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    const modal = document.querySelector('[role="dialog"]') as HTMLElement;
    if (!modal) return;

    // Get all focusable elements in modal
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element (usually search input)
    firstFocusable?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);
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
