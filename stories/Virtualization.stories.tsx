import type { Meta, StoryObj } from '@storybook/react';
import { LookupSelect } from '../src/components/LookupSelect';
import '../src/styles.css';

// Generate large datasets for virtualization testing
const generateLargeUserDataset = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    userId: i + 1,
    firstName: `User${i + 1}`,
    lastName: `Lastname${i + 1}`,
    email: `user${i + 1}@company${Math.floor(i / 100) + 1}.com`,
    department: [
      'Engineering',
      'Product',
      'Design',
      'Marketing',
      'Sales',
      'HR',
      'Finance',
      'Operations',
    ][i % 8],
    role: `${['Junior', 'Mid', 'Senior', 'Lead', 'Principal'][i % 5]} ${['Developer', 'Manager', 'Designer', 'Analyst'][i % 4]}`,
    location: [
      'New York',
      'San Francisco',
      'London',
      'Berlin',
      'Tokyo',
      'Sydney',
      'Toronto',
      'Amsterdam',
    ][i % 8],
    joinDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1)
      .toISOString()
      .split('T')[0],
    salary: 50000 + (i % 150) * 1000,
    status: ['Active', 'On Leave', 'Remote'][i % 3],
  }));

// Different dataset sizes
const smallDataset = generateLargeUserDataset(1000); // 1K records
const mediumDataset = generateLargeUserDataset(5000); // 5K records
const largeDataset = generateLargeUserDataset(10000); // 10K records
const extraLargeDataset = generateLargeUserDataset(25000); // 25K records

// Column definitions optimized for performance
const performanceColumns = [
  { key: 'userId', title: 'ID', width: 80 },
  { key: 'firstName', title: 'First Name', width: 120 },
  { key: 'lastName', title: 'Last Name', width: 120 },
  { key: 'department', title: 'Department', width: 120 },
  { key: 'role', title: 'Role', width: 150 },
  { key: 'location', title: 'Location', width: 120 },
];

// Detailed columns for rich rendering
const detailedColumns = [
  { key: 'userId', title: 'ID', width: 60 },
  { key: 'firstName', title: 'First Name', width: 100 },
  { key: 'lastName', title: 'Last Name', width: 100 },
  { key: 'email', title: 'Email', width: 200 },
  { key: 'department', title: 'Department', width: 100 },
  { key: 'role', title: 'Role', width: 150 },
  { key: 'location', title: 'Location', width: 100 },
  { key: 'joinDate', title: 'Join Date', width: 100 },
  {
    key: 'salary',
    title: 'Salary',
    width: 100,
    render: (row: any) => (
      <span style={{ fontWeight: 600 }}>${row.salary.toLocaleString()}</span>
    ),
  },
];

// User mapper
const userMapper = {
  getId: (user: any) => user.userId,
  getText: (user: any) => `${user.firstName} ${user.lastName}`,
};

const meta: Meta<typeof LookupSelect> = {
  title: 'Components/LookupSelect/Virtualization',
  component: LookupSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Virtualization examples demonstrating performance with large datasets (1K-25K records).',
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
    virtualization: {
      control: 'boolean',
      description: 'Enable virtualization for large datasets',
    },
    virtualRowHeight: {
      control: 'number',
      description: 'Fixed row height for virtualization (px)',
    },
    virtualContainerHeight: {
      control: 'number',
      description: 'Virtual container height (px)',
    },
    onChange: { action: 'changed' },
    onConfirm: { action: 'confirmed' },
    onCancel: { action: 'cancelled' },
    onSelectionChange: { action: 'selection-changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 1K records - Small dataset
export const SmallDataset_1K: Story = {
  args: {
    data: smallDataset,
    columns: performanceColumns,
    mapper: userMapper,
    mode: 'single',
    returnShape: 'id-text',
    virtualization: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '1,000 records with virtualization enabled. Good baseline for performance comparison.',
      },
    },
  },
};

// 5K records - Medium dataset
export const MediumDataset_5K: Story = {
  args: {
    data: mediumDataset,
    columns: performanceColumns,
    mapper: userMapper,
    mode: 'single',
    returnShape: 'id-text',
    virtualization: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '5,000 records with virtualization. Tests scrolling performance with moderate load.',
      },
    },
  },
};

// 10K records - Large dataset
export const LargeDataset_10K: Story = {
  args: {
    data: largeDataset,
    columns: performanceColumns,
    mapper: userMapper,
    mode: 'single',
    returnShape: 'id-text',
    virtualization: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '10,000 records with virtualization. Tests performance with large datasets.',
      },
    },
  },
};

// 25K records - Extra large dataset
export const ExtraLargeDataset_25K: Story = {
  args: {
    data: extraLargeDataset,
    columns: performanceColumns,
    mapper: userMapper,
    mode: 'single',
    returnShape: 'id-text',
    virtualization: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '25,000 records with virtualization. Stress test for maximum performance.',
      },
    },
  },
};

// Multiple selection with large dataset
export const MultipleSelection_10K: Story = {
  args: {
    data: largeDataset,
    columns: performanceColumns,
    mapper: userMapper,
    mode: 'multiple',
    returnShape: 'id-text',
    virtualization: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple selection with 10K records. Tests checkbox performance and selection state management.',
      },
    },
  },
};

// Detailed columns with large dataset
export const DetailedColumns_5K: Story = {
  args: {
    data: mediumDataset,
    columns: detailedColumns,
    mapper: userMapper,
    mode: 'single',
    returnShape: 'id-text',
    virtualization: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '5K records with detailed columns including custom renderers. Tests rendering performance.',
      },
    },
  },
};

// Performance comparison - Non-virtualized (use with caution)
export const NonVirtualized_1K: Story = {
  args: {
    data: smallDataset,
    columns: performanceColumns,
    mapper: userMapper,
    mode: 'single',
    returnShape: 'id-text',
    virtualization: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          '1K records WITHOUT virtualization. Compare performance with virtualized version. ⚠️ May be slow!',
      },
    },
  },
};

// Custom row height virtualization
export const CustomRowHeight: Story = {
  args: {
    data: mediumDataset,
    columns: [
      { key: 'userId', title: 'ID', width: 60 },
      {
        key: 'userInfo',
        title: 'User Information',
        width: 300,
        render: (row: any) => (
          <div style={{ padding: '8px 0' }}>
            <div
              style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}
            >
              {row.firstName} {row.lastName}
            </div>
            <div
              style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}
            >
              {row.role} • {row.department}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              📧 {row.email} | 📍 {row.location}
            </div>
          </div>
        ),
      },
      {
        key: 'salary',
        title: 'Salary',
        width: 100,
        render: (row: any) => (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, color: '#2e7d32' }}>
              ${row.salary.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>{row.status}</div>
          </div>
        ),
      },
    ],
    mapper: userMapper,
    mode: 'single',
    returnShape: 'id-text',
    virtualization: true,
    virtualRowHeight: 80, // Custom row height for complex content
  },
  parameters: {
    docs: {
      description: {
        story:
          '5K records with custom row height (80px) for complex content. Shows rich user cards.',
      },
    },
  },
};

// Search performance with large dataset
export const SearchPerformance_10K: Story = {
  args: {
    data: largeDataset,
    columns: performanceColumns,
    mapper: userMapper,
    mode: 'single',
    returnShape: 'id-text',
    virtualization: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '10K records with virtualization and search. Tests search filtering performance on large datasets.',
      },
    },
  },
};

// Mixed content virtualization
export const MixedContent_5K: Story = {
  args: {
    data: mediumDataset,
    columns: [
      { key: 'userId', title: 'ID', width: 50 },
      {
        key: 'name',
        title: 'Name',
        width: 150,
        render: (row: any) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: `hsl(${row.userId * 137.508}deg, 50%, 60%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '10px',
                fontWeight: 600,
              }}
            >
              {row.firstName[0]}
              {row.lastName[0]}
            </div>
            <span>
              {row.firstName} {row.lastName}
            </span>
          </div>
        ),
      },
      {
        key: 'department',
        title: 'Department',
        width: 120,
        render: (row: any) => (
          <span
            style={{
              padding: '2px 6px',
              borderRadius: '12px',
              fontSize: '11px',
              backgroundColor: '#f0f0f0',
              color: '#333',
            }}
          >
            {row.department}
          </span>
        ),
      },
      { key: 'location', title: 'Location', width: 100 },
    ],
    mapper: userMapper,
    mode: 'multiple',
    returnShape: 'id-text',
    virtualization: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '5K records with mixed content (avatars, badges, text) testing complex rendering performance.',
      },
    },
  },
};
