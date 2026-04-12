import { describe, it, expect, vi } from 'vitest';
import { Trigger } from '../Trigger';
import { render, screen, mockMapper, createMockUsers } from '../../test-utils';

describe('Trigger', () => {
  const defaultProps = {
    isOpen: false,
    onToggle: vi.fn(),
    selectedItems: [] as ReturnType<typeof createMockUsers>,
    mapper: mockMapper,
    mode: 'single' as const,
  };

  it('shows placeholder when no items are selected', () => {
    render(<Trigger {...defaultProps} />);
    expect(screen.getByText('Please select')).toBeInTheDocument();
  });

  it('shows custom placeholder when provided', () => {
    render(<Trigger {...defaultProps} placeholder="Choose a user" />);
    expect(screen.getByText('Choose a user')).toBeInTheDocument();
  });

  it('shows selected text in single mode', () => {
    const users = createMockUsers(1);
    render(
      <Trigger {...defaultProps} mode="single" selectedItems={users} />
    );
    expect(screen.getByText('User 1 Surname 1')).toBeInTheDocument();
    expect(screen.queryByText('Please select')).not.toBeInTheDocument();
  });

  it('shows tags in multiple mode', () => {
    const users = createMockUsers(3);
    render(
      <Trigger {...defaultProps} mode="multiple" selectedItems={users} />
    );
    expect(screen.getByText('User 1 Surname 1')).toBeInTheDocument();
    expect(screen.getByText('User 2 Surname 2')).toBeInTheDocument();
    expect(screen.getByText('User 3 Surname 3')).toBeInTheDocument();
  });

  it('shows "+N more" badge when more than 3 items in multiple mode', () => {
    const users = createMockUsers(5);
    render(
      <Trigger {...defaultProps} mode="multiple" selectedItems={users} />
    );
    // First 3 tags visible
    expect(screen.getByText('User 1 Surname 1')).toBeInTheDocument();
    expect(screen.getByText('User 2 Surname 2')).toBeInTheDocument();
    expect(screen.getByText('User 3 Surname 3')).toBeInTheDocument();
    // 4th and 5th should not have their own tags
    expect(screen.queryByText('User 4 Surname 4')).not.toBeInTheDocument();
    expect(screen.queryByText('User 5 Surname 5')).not.toBeInTheDocument();
    // Badge showing remaining count
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    const { user } = render(
      <Trigger {...defaultProps} onToggle={onToggle} />
    );
    await user.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onClear when clear button is clicked', async () => {
    const onClear = vi.fn();
    const onToggle = vi.fn();
    const users = createMockUsers(1);
    const { user } = render(
      <Trigger
        {...defaultProps}
        onToggle={onToggle}
        selectedItems={users}
        onClear={onClear}
      />
    );
    const clearButton = screen.getByLabelText('Clear selection');
    await user.click(clearButton);
    expect(onClear).toHaveBeenCalledTimes(1);
    // onToggle should NOT be called because stopPropagation
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('opens trigger on Enter key', async () => {
    const onToggle = vi.fn();
    const { user } = render(
      <Trigger {...defaultProps} onToggle={onToggle} />
    );
    const trigger = screen.getByRole('button');
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('opens trigger on Space key', async () => {
    const onToggle = vi.fn();
    const { user } = render(
      <Trigger {...defaultProps} onToggle={onToggle} />
    );
    const trigger = screen.getByRole('button');
    trigger.focus();
    await user.keyboard(' ');
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
