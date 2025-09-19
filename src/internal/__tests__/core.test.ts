import { describe, it, expect } from 'vitest';
import {
  createSelectionState,
  SelectionManager,
  QueryManager,
  createQueryState,
  mapReturnValue,
  SelectionState,
} from '../core';
import { createMockUsers, mockMapper } from '../../test-utils';

describe('Core Logic', () => {
  const mockData = createMockUsers(5);

  describe('createSelectionState', () => {
    it('should create empty selection state', () => {
      const state = createSelectionState();

      expect(state.selectedIds).toEqual(new Set());
      expect(state.selectedRows).toEqual(new Map());
    });
  });

  describe('SelectionManager', () => {
    it('should initialize with empty state', () => {
      const manager = new SelectionManager('single', mockMapper);
      const state = manager.getState();

      expect(state.selectedIds).toEqual(new Set());
      expect(state.selectedRows).toEqual(new Map());
    });

    it('should select row in single mode', () => {
      const manager = new SelectionManager('single', mockMapper);
      const state = manager.toggleRow(mockData[0]);

      expect(state.selectedIds).toEqual(new Set([1]));
      expect(state.selectedRows.get(1)).toEqual(mockData[0]);
    });

    it('should replace selection in single mode', () => {
      const manager = new SelectionManager('single', mockMapper);

      manager.toggleRow(mockData[0]);
      const state = manager.toggleRow(mockData[1]);

      expect(state.selectedIds).toEqual(new Set([2]));
      expect(state.selectedRows.get(2)).toEqual(mockData[1]);
      expect(state.selectedRows.has(1)).toBe(false);
    });

    it('should add to selection in multiple mode', () => {
      const manager = new SelectionManager('multiple', mockMapper);

      manager.toggleRow(mockData[0]);
      const state = manager.toggleRow(mockData[1]);

      expect(state.selectedIds).toEqual(new Set([1, 2]));
      expect(state.selectedRows.size).toBe(2);
    });

    it('should remove from selection when toggling selected row', () => {
      const manager = new SelectionManager('multiple', mockMapper);

      manager.toggleRow(mockData[0]);
      manager.toggleRow(mockData[1]);
      const state = manager.toggleRow(mockData[0]);

      expect(state.selectedIds).toEqual(new Set([2]));
      expect(state.selectedRows.has(1)).toBe(false);
      expect(state.selectedRows.get(2)).toEqual(mockData[1]);
    });

    it('should check if row is selected', () => {
      const manager = new SelectionManager('single', mockMapper);

      expect(manager.isRowSelected(mockData[0])).toBe(false);

      manager.toggleRow(mockData[0]);
      expect(manager.isRowSelected(mockData[0])).toBe(true);
    });

    it('should get selected rows as array', () => {
      const manager = new SelectionManager('multiple', mockMapper);

      manager.toggleRow(mockData[0]);
      manager.toggleRow(mockData[1]);

      const selectedRows = manager.getSelectedRows();
      expect(selectedRows).toHaveLength(2);
      expect(selectedRows).toContain(mockData[0]);
      expect(selectedRows).toContain(mockData[1]);
    });

    it('should clear all selections', () => {
      const manager = new SelectionManager('multiple', mockMapper);

      manager.toggleRow(mockData[0]);
      manager.toggleRow(mockData[1]);

      const state = manager.clearSelection();
      expect(state.selectedIds.size).toBe(0);
      expect(state.selectedRows.size).toBe(0);
    });
  });

  describe('createQueryState', () => {
    it('should create default query state', () => {
      const state = createQueryState();

      expect(state).toEqual({
        page: 1,
        pageSize: 20,
        search: undefined,
        sortBy: undefined,
        sortDir: undefined,
      });
    });

    it('should create query state with custom page size', () => {
      const state = createQueryState(10);

      expect(state.pageSize).toBe(10);
    });
  });

  describe('QueryManager', () => {
    it('should initialize with default state', () => {
      const manager = new QueryManager();
      const state = manager.getState();

      expect(state.page).toBe(1);
      expect(state.pageSize).toBe(20);
    });

    it('should update search and reset page', () => {
      const manager = new QueryManager();
      manager.updatePage(3);

      const state = manager.updateSearch('test');

      expect(state.search).toBe('test');
      expect(state.page).toBe(1);
    });

    it('should update page', () => {
      const manager = new QueryManager();
      const state = manager.updatePage(2);

      expect(state.page).toBe(2);
    });

    it('should update sort and reset page', () => {
      const manager = new QueryManager();
      manager.updatePage(3);

      const state = manager.updateSort('name', 'asc');

      expect(state.sortBy).toBe('name');
      expect(state.sortDir).toBe('asc');
      expect(state.page).toBe(1);
    });

    it('should update page size and reset page', () => {
      const manager = new QueryManager();
      manager.updatePage(3);

      const state = manager.updatePageSize(50);

      expect(state.pageSize).toBe(50);
      expect(state.page).toBe(1);
    });
  });

  describe('mapReturnValue', () => {
    const selectedRows = [mockData[0], mockData[1]];

    it('should return id-text for single mode', () => {
      const result = mapReturnValue([mockData[0]], {
        returnShape: 'id-text',
        mapper: mockMapper,
        mode: 'single',
      });

      expect(result).toEqual({
        id: 1,
        text: 'User 1 Surname 1',
      });
    });

    it('should return id-text array for multiple mode', () => {
      const result = mapReturnValue(selectedRows, {
        returnShape: 'id-text',
        mapper: mockMapper,
        mode: 'multiple',
      });

      expect(result).toEqual([
        { id: 1, text: 'User 1 Surname 1' },
        { id: 2, text: 'User 2 Surname 2' },
      ]);
    });

    it('should return row object for single mode', () => {
      const result = mapReturnValue([mockData[0]], {
        returnShape: 'row',
        mapper: mockMapper,
        mode: 'single',
      });

      expect(result).toEqual(mockData[0]);
    });

    it('should return row array for multiple mode', () => {
      const result = mapReturnValue(selectedRows, {
        returnShape: 'row',
        mapper: mockMapper,
        mode: 'multiple',
      });

      expect(result).toEqual([mockData[0], mockData[1]]);
    });

    it('should return custom mapped value', () => {
      const returnMap = {
        map: (row: any) => ({
          fullName: `${row.name} ${row.surname}`,
          age: row.age,
        }),
      };

      const result = mapReturnValue(selectedRows, {
        returnShape: 'custom',
        returnMap,
        mapper: mockMapper,
        mode: 'multiple',
      });

      expect(result).toEqual([
        { fullName: 'User 1 Surname 1', age: 21 },
        { fullName: 'User 2 Surname 2', age: 22 },
      ]);
    });

    it('should return null for empty single selection', () => {
      const result = mapReturnValue([], {
        returnShape: 'id-text',
        mapper: mockMapper,
        mode: 'single',
      });

      expect(result).toBeNull();
    });

    it('should return empty array for empty multiple selection', () => {
      const result = mapReturnValue([], {
        returnShape: 'id-text',
        mapper: mockMapper,
        mode: 'multiple',
      });

      expect(result).toEqual([]);
    });

    it('should throw error for custom shape without returnMap', () => {
      expect(() => {
        mapReturnValue([mockData[0]], {
          returnShape: 'custom',
          mapper: mockMapper,
          mode: 'single',
        });
      }).toThrow('returnMap is required when returnShape is "custom"');
    });
  });
});
