import type { Meta, StoryObj } from '@storybook/react';
import { LookupSelect } from '../src/components/LookupSelect';
import { QueryState, DataSourceResult } from '../src/internal/types';
import '../src/styles.css';

// Mock large dataset for server-side simulation
const generateMockCustomers = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    customerId: i + 1,
    firstName: `Customer${i + 1}`,
    lastName: `Last${i + 1}`,
    email: `customer${i + 1}@example.com`,
    company: `Company ${Math.floor(i / 10) + 1}`,
    country: ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan'][i % 6],
    status: ['Active', 'Inactive', 'Pending'][i % 3],
    registrationDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1)
      .toISOString()
      .split('T')[0],
  }));

const mockCustomers = generateMockCustomers(1000); // Large dataset

// Column definitions
const customerColumns = [
  { key: 'firstName', title: 'First Name', width: 100 },
  { key: 'lastName', title: 'Last Name', width: 100 },
  { key: 'company', title: 'Company', width: 150 },
  { key: 'country', title: 'Country', width: 100 },
  { key: 'status', title: 'Status', width: 80 },
  { key: 'email', title: 'Email', width: 200 },
];

// Mapper configuration
const customerMapper = {
  getId: (customer: any) => customer.customerId,
  getText: (customer: any) => `${customer.firstName} ${customer.lastName}`,
};

// Mock server-side data source with search, pagination, and sorting
const createMockDataSource = (dataset: any[], delay = 800) => {
  return async (query: QueryState): Promise<DataSourceResult<any>> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    let filteredData = [...dataset];

    // Apply search filter
    if (query.search && query.search.trim()) {
      const searchTerm = query.search.toLowerCase();
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply sorting
    if (query.sortBy && query.sortDir) {
      filteredData.sort((a, b) => {
        const aValue = String(a[query.sortBy!]);
        const bValue = String(b[query.sortBy!]);

        if (query.sortDir === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    // Apply pagination
    const total = filteredData.length;
    const start = (query.page - 1) * query.pageSize;
    const end = start + query.pageSize;
    const rows = filteredData.slice(start, end);

    return {
      rows,
      total,
    };
  };
};

// Fast data source (100ms delay)
const createFastDataSource = (dataset: any[]) =>
  createMockDataSource(dataset, 100);

// Slow data source (2s delay)
const createSlowDataSource = (dataset: any[]) =>
  createMockDataSource(dataset, 2000);

const meta: Meta<typeof LookupSelect> = {
  title: 'Components/LookupSelect/Server-side Data',
  component: LookupSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Server-side data source stories showcasing async data loading with search, pagination, and sorting.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Selection mode: single or multiple',
    },
    returnShape: {
      control: 'select',
      options: ['id-text', 'row', 'custom'],
      description: 'Shape of the returned value',
    },
    onChange: { action: 'changed' },
    onConfirm: { action: 'confirmed' },
    onCancel: { action: 'cancelled' },
    onSelectionChange: { action: 'selection-changed' },
    onQueryChange: { action: 'query-changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic server-side single selection
export const ServerSideSingle: Story = {
  args: {
    dataSource: createMockDataSource(mockCustomers),
    columns: customerColumns,
    mapper: customerMapper,
    mode: 'single',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Single selection with server-side data source. Data is loaded asynchronously with pagination (20 items per page).',
      },
    },
  },
};

// Server-side multiple selection
export const ServerSideMultiple: Story = {
  args: {
    dataSource: createMockDataSource(mockCustomers),
    columns: customerColumns,
    mapper: customerMapper,
    mode: 'multiple',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple selection with server-side data source. Users can select multiple customers across different pages.',
      },
    },
  },
};

// Server-side with search functionality
export const ServerSideWithSearch: Story = {
  args: {
    dataSource: createMockDataSource(mockCustomers),
    columns: customerColumns,
    mapper: customerMapper,
    mode: 'single',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Server-side data with search functionality. Type in the search box to filter customers on the server.',
      },
    },
  },
};

// Server-side with sorting
export const ServerSideWithSorting: Story = {
  args: {
    dataSource: createMockDataSource(mockCustomers),
    columns: customerColumns.map((col) => ({ ...col, sortable: true })),
    mapper: customerMapper,
    mode: 'single',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Server-side data with sortable columns. Click on column headers to sort data on the server.',
      },
    },
  },
};

// Fast server response
export const FastServerResponse: Story = {
  args: {
    dataSource: createFastDataSource(mockCustomers),
    columns: customerColumns,
    mapper: customerMapper,
    mode: 'single',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Server-side data source with fast response time (100ms). Good for testing responsive UX.',
      },
    },
  },
};

// Slow server response
export const SlowServerResponse: Story = {
  args: {
    dataSource: createSlowDataSource(mockCustomers),
    columns: customerColumns,
    mapper: customerMapper,
    mode: 'single',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Server-side data source with slow response time (2s). Shows loading states and spinners.',
      },
    },
  },
};

// Server-side with custom page size
export const CustomPageSize: Story = {
  args: {
    dataSource: createMockDataSource(mockCustomers),
    columns: customerColumns,
    mapper: customerMapper,
    mode: 'single',
    returnShape: 'id-text',
    pageSize: 10,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Server-side data with custom page size (10 items). Smaller pages load faster but require more navigation.',
      },
    },
  },
};

// Server-side with error simulation
const createErrorDataSource = () => {
  return async (query: QueryState): Promise<DataSourceResult<any>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate occasional errors
    if (Math.random() < 0.3) {
      throw new Error('Failed to fetch data from server');
    }

    return createMockDataSource(mockCustomers.slice(0, 50))(query);
  };
};

export const ServerSideWithErrors: Story = {
  args: {
    dataSource: createErrorDataSource(),
    columns: customerColumns,
    mapper: customerMapper,
    mode: 'single',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Server-side data source that occasionally fails (30% chance). Shows error handling and retry mechanisms.',
      },
    },
  },
};

// Server-side returning full objects
export const ServerSideReturnRows: Story = {
  args: {
    dataSource: createMockDataSource(mockCustomers),
    columns: customerColumns,
    mapper: customerMapper,
    mode: 'multiple',
    returnShape: 'row',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Server-side multiple selection returning full customer objects instead of id-text pairs.',
      },
    },
  },
};
