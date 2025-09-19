import React from 'react';
import { LookupSelectProps } from '../internal/types';

/**
 * Trigger bileşeni - ComboBox görünümü, tıklanınca modal açılır
 * Project.md Bölüm 3: Trigger role="button" + aria-haspopup="dialog"
 */

interface TriggerProps<T> {
  isOpen: boolean;
  onToggle: () => void;
  selectedItems: T[];
  placeholder?: string;
  icon?: React.ReactNode;
  mapper: LookupSelectProps<T>['mapper'];
  mode: LookupSelectProps<T>['mode'];
  className?: string;
  style?: React.CSSProperties;
  renderTrigger?: (selected: T | T[] | null) => React.ReactNode;
}

export function Trigger<T>({
  isOpen,
  onToggle,
  selectedItems,
  placeholder = 'Seçiniz',
  icon,
  mapper,
  mode = 'single',
  className,
  style,
  renderTrigger,
}: TriggerProps<T>) {
  const selectedValue =
    mode === 'single' ? selectedItems[0] || null : selectedItems;

  // Custom trigger varsa onu kullan
  if (renderTrigger) {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className={className}
        style={style}
      >
        {renderTrigger(selectedValue)}
      </div>
    );
  }

  // Default trigger görünümü
  return (
    <div
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      className={`lookup-select__trigger ${className || ''}`}
      style={style}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="lookup-select__trigger-content">
        {selectedItems.length === 0 ? (
          <span className="lookup-select__placeholder">{placeholder}</span>
        ) : mode === 'single' ? (
          <span className="lookup-select__selected-text">
            {mapper.getText(selectedItems[0])}
          </span>
        ) : (
          <div className="lookup-select__tags">
            {selectedItems.slice(0, 3).map((item) => (
              <span key={mapper.getId(item)} className="lookup-select__tag">
                {mapper.getText(item)}
                <button
                  type="button"
                  className="lookup-select__tag-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Remove single tag functionality
                  }}
                  aria-label={`Remove ${mapper.getText(item)}`}
                >
                  ×
                </button>
              </span>
            ))}
            {selectedItems.length > 3 && (
              <span className="lookup-select__tag lookup-select__tag--more">
                +{selectedItems.length - 3} daha
              </span>
            )}
          </div>
        )}
      </div>

      <div className="lookup-select__trigger-icon">
        {icon || (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
