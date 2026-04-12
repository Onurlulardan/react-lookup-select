import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { Modal, SearchInput, ModalFooter } from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders nothing when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders portal with dialog role when isOpen is true', () => {
    render(<Modal {...defaultProps} isOpen={true} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} isOpen={true} onClose={onClose} />);
    const overlay = document.querySelector('.lookup-select__modal-overlay')!;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Modal content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('prevents body scroll when open', () => {
    const { unmount } = render(
      <Modal {...defaultProps} isOpen={true} />
    );
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('has correct ARIA attributes', () => {
    render(
      <Modal
        {...defaultProps}
        isOpen={true}
        ariaLabel="Custom label"
        ariaDescribedBy="desc-id"
        closeButtonLabel="Dismiss"
      />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Custom label');
    expect(dialog).toHaveAttribute('aria-describedby', 'desc-id');
    expect(screen.getByLabelText('Dismiss')).toBeInTheDocument();
  });

  it('uses aria-labelledby with title id when no ariaLabelledBy prop', () => {
    render(<Modal {...defaultProps} isOpen={true} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute(
      'aria-labelledby',
      'lookup-select-modal-title'
    );
  });
});

describe('SearchInput', () => {
  it('renders with data-autofocus attribute', () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: /search records/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('data-autofocus');
  });

  it('calls onChange when user types', () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} placeholder="Search..." />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalledWith('test');
  });
});

describe('ModalFooter', () => {
  const defaultFooterProps = {
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows "No selection" when selectedCount is 0', () => {
    render(<ModalFooter {...defaultFooterProps} selectedCount={0} />);
    expect(screen.getByText('No selection')).toBeInTheDocument();
  });

  it('shows selected count when items are selected', () => {
    render(<ModalFooter {...defaultFooterProps} selectedCount={3} />);
    expect(screen.getByText('3 selected')).toBeInTheDocument();
  });

  it('renders confirm and cancel buttons with default text', () => {
    render(<ModalFooter {...defaultFooterProps} />);
    expect(screen.getByText('Apply')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders confirm and cancel buttons with custom text', () => {
    render(
      <ModalFooter
        {...defaultFooterProps}
        confirmText="Save"
        cancelText="Dismiss"
      />
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('disables confirm button when selectedCount is 0', () => {
    render(<ModalFooter {...defaultFooterProps} selectedCount={0} />);
    expect(screen.getByText('Apply')).toBeDisabled();
  });

  it('enables confirm button when selectedCount > 0', () => {
    render(<ModalFooter {...defaultFooterProps} selectedCount={2} />);
    expect(screen.getByText('Apply')).toBeEnabled();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ModalFooter {...defaultFooterProps} onConfirm={onConfirm} selectedCount={1} />
    );
    fireEvent.click(screen.getByText('Apply'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<ModalFooter {...defaultFooterProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
