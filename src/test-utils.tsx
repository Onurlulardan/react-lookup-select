import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Test data generators
export const createMockUser = (id: number) => ({
  userId: id,
  name: `User ${id}`,
  surname: `Surname ${id}`,
  email: `user${id}@test.com`,
  age: 20 + id,
});

export const createMockUsers = (count: number) =>
  Array.from({ length: count }, (_, i) => createMockUser(i + 1));

// Common test props
export const mockMapper = {
  getId: (user: any) => user.userId,
  getText: (user: any) => `${user.name} ${user.surname}`,
};

export const mockColumns = [
  { key: 'name', title: 'Name' },
  { key: 'surname', title: 'Surname' },
  { key: 'email', title: 'Email' },
];

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, options),
  };
};

export * from '@testing-library/react';
export { customRender as render };
export { userEvent };

// Test helpers
export const waitForModalToOpen = () =>
  new Promise((resolve) => setTimeout(resolve, 100));

export const waitForModalToClose = () =>
  new Promise((resolve) => setTimeout(resolve, 100));

// Mock DataSource for async tests
export const createMockDataSource = (data: any[], delay = 100) => {
  return async (query: any) => {
    await new Promise((resolve) => setTimeout(resolve, delay));

    const { page = 1, pageSize = 10, search = '' } = query;

    let filtered = data;
    if (search) {
      filtered = data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      rows: filtered.slice(start, end),
      total: filtered.length,
    };
  };
};
