import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal component - header/search/body/footer
 */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  // ARIA & Accessibility props
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  closeButtonLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  title = 'Select Record',
  className,
  style,
  children,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  closeButtonLabel = 'Close modal',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    // Store currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus first focusable element in modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Handle Tab key for focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);

      // Restore focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="lookup-select__modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={
          ariaLabelledBy || (title ? 'lookup-select-modal-title' : undefined)
        }
        aria-describedby={ariaDescribedBy}
        className={`lookup-select__modal ${className || ''}`}
        style={style}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="lookup-select__modal-header">
          <h2
            id="lookup-select-modal-title"
            className="lookup-select__modal-title"
          >
            {title}
          </h2>
          <button
            type="button"
            className="lookup-select__modal-close"
            onClick={onClose}
            aria-label={closeButtonLabel}
            tabIndex={0}
          >
            ×
          </button>
        </div>

        <div className="lookup-select__modal-body" role="document">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Search input component - for searching within modal
 */
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={`lookup-select__search ${className || ''}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="lookup-select__search-input"
        aria-label="Search records"
      />
      <div className="lookup-select__search-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Modal footer - confirm/cancel buttons
 */
interface ModalFooterProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  selectedCount?: number;
  className?: string;
}

export function ModalFooter({
  onConfirm,
  onCancel,
  confirmText = 'Apply',
  cancelText = 'Cancel',
  selectedCount = 0,
  className,
}: ModalFooterProps) {
  return (
    <div className={`lookup-select__modal-footer ${className || ''}`}>
      <div className="lookup-select__selected-count">
        {selectedCount > 0 ? `${selectedCount} selected` : 'No selection'}
      </div>

      <div className="lookup-select__modal-actions">
        <button
          type="button"
          className="lookup-select__button lookup-select__button--secondary"
          onClick={onCancel}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className="lookup-select__button lookup-select__button--primary"
          onClick={onConfirm}
          disabled={selectedCount === 0}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
