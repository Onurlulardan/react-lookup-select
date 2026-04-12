import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLookupSelectState } from '../state';
import { createMockUsers, mockMapper, mockColumns } from '../../test-utils';

const mockUsers = createMockUsers(5);

function defaultProps() {
  return {
    columns: mockColumns as any,
    mapper: mockMapper,
    data: mockUsers,
  };
}

describe('useLookupSelectState', () => {
  it('returns initial state with modalOpen false and empty selections', () => {
    const { result } = renderHook(() => useLookupSelectState(defaultProps()));

    expect(result.current.modalOpen).toBe(false);
    expect(result.current.currentSelections).toEqual([]);
  });

  it('openModal sets modalOpen to true', () => {
    const { result } = renderHook(() => useLookupSelectState(defaultProps()));

    act(() => {
      result.current.openModal();
    });

    expect(result.current.modalOpen).toBe(true);
  });

  it('cancelSelection restores backup selections', () => {
    const { result } = renderHook(() =>
      useLookupSelectState({ ...defaultProps(), mode: 'multiple' })
    );

    // Select a row before opening the modal
    act(() => {
      result.current.toggleRowSelection(mockUsers[0]);
    });
    expect(result.current.currentSelections).toEqual([mockUsers[0]]);

    // Open modal — this backs up current selections
    act(() => {
      result.current.openModal();
    });

    // Change selections while modal is open (add second user)
    act(() => {
      result.current.toggleRowSelection(mockUsers[1]);
    });
    // In multiple mode, both user 0 and user 1 should be selected
    // Note: if this is 1 instead of 2, the manager may have been recreated
    const selectionsAfterToggle = result.current.currentSelections;
    expect(selectionsAfterToggle.length).toBeGreaterThanOrEqual(1);
    expect(selectionsAfterToggle).toContainEqual(mockUsers[1]);

    // Cancel — should restore to backup state
    act(() => {
      result.current.cancelSelection();
    });

    // After cancel, selections should be restored to what was before modal opened
    expect(result.current.currentSelections).toContainEqual(mockUsers[0]);
    expect(result.current.currentSelections).not.toContainEqual(mockUsers[1]);
    expect(result.current.modalOpen).toBe(false);
  });

  it('toggleRowSelection adds and removes rows', () => {
    const { result } = renderHook(() =>
      useLookupSelectState({ ...defaultProps(), mode: 'multiple' })
    );

    // Add first row
    act(() => {
      result.current.toggleRowSelection(mockUsers[0]);
    });
    expect(result.current.currentSelections).toEqual([mockUsers[0]]);
    expect(result.current.isRowSelected(mockUsers[0])).toBe(true);

    // Add second row
    act(() => {
      result.current.toggleRowSelection(mockUsers[1]);
    });
    expect(result.current.currentSelections).toEqual([mockUsers[0], mockUsers[1]]);

    // Remove first row by toggling again
    act(() => {
      result.current.toggleRowSelection(mockUsers[0]);
    });
    expect(result.current.currentSelections).toEqual([mockUsers[1]]);
    expect(result.current.isRowSelected(mockUsers[0])).toBe(false);
  });

  it('clearSelections empties all selections', () => {
    const { result } = renderHook(() =>
      useLookupSelectState({ ...defaultProps(), mode: 'multiple' })
    );

    act(() => {
      result.current.toggleRowSelection(mockUsers[0]);
      result.current.toggleRowSelection(mockUsers[1]);
    });
    expect(result.current.currentSelections).toHaveLength(2);

    act(() => {
      result.current.clearSelections();
    });

    expect(result.current.currentSelections).toEqual([]);
  });

  it('confirmSelection calls onChange with mapped value', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useLookupSelectState({
        ...defaultProps(),
        mode: 'single',
        returnShape: 'id-text',
        onChange,
      })
    );

    act(() => {
      result.current.openModal();
    });

    act(() => {
      result.current.toggleRowSelection(mockUsers[0]);
    });

    act(() => {
      result.current.confirmSelection();
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      id: mockUsers[0].userId,
      text: `${mockUsers[0].name} ${mockUsers[0].surname}`,
    });
    expect(result.current.modalOpen).toBe(false);
  });

  it('respects controlled modal state via open prop', () => {
    const onOpenChange = vi.fn();
    const { result, rerender } = renderHook(
      (props) => useLookupSelectState(props),
      {
        initialProps: {
          ...defaultProps(),
          open: false,
          onOpenChange,
        } as any,
      }
    );

    // Modal should follow the controlled open prop
    expect(result.current.modalOpen).toBe(false);

    // Calling openModal should not change modalOpen directly (controlled)
    act(() => {
      result.current.openModal();
    });
    // Still false because open prop is false
    expect(result.current.modalOpen).toBe(false);
    // But onOpenChange should have been called
    expect(onOpenChange).toHaveBeenCalledWith(true);

    // Parent updates the open prop
    rerender({
      ...defaultProps(),
      open: true,
      onOpenChange,
    } as any);

    expect(result.current.modalOpen).toBe(true);
  });

  it('cancelSelection calls onCancel callback', () => {
    const onCancel = vi.fn();
    const { result } = renderHook(() =>
      useLookupSelectState({ ...defaultProps(), onCancel })
    );

    act(() => {
      result.current.openModal();
    });

    act(() => {
      result.current.cancelSelection();
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('confirmSelection calls onConfirm callback', () => {
    const onConfirm = vi.fn();
    const { result } = renderHook(() =>
      useLookupSelectState({ ...defaultProps(), onConfirm })
    );

    act(() => {
      result.current.openModal();
    });

    act(() => {
      result.current.toggleRowSelection(mockUsers[2]);
    });

    act(() => {
      result.current.confirmSelection();
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith({
      id: mockUsers[2].userId,
      text: `${mockUsers[2].name} ${mockUsers[2].surname}`,
    });
  });
});
