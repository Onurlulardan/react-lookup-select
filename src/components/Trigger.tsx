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
  onClear?: () => void;
  onRemoveTag?: (item: T) => void;
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
  onClear,
  onRemoveTag,
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
                    onRemoveTag?.(item);
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

      <div className="lookup-select__trigger-actions">
        {/* Clear button - sadece seçim varsa göster */}
        {selectedItems.length > 0 && onClear && (
          <button
            type="button"
            className="lookup-select__clear-button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            aria-label="Clear selection"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M10.5 5.5L5.5 10.5M5.5 5.5L10.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Dropdown icon */}
        <div className="lookup-select__trigger-icon">
          {icon || (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
