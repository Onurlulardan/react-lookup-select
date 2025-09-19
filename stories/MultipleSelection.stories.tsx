import type { Meta, StoryObj } from '@storybook/react';
import { LookupSelect } from '../src/components/LookupSelect';
import '../src/styles.css';

// Mock data - larger dataset for multiple selection
const employees = [
  {
    userId: 1,
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    role: 'Senior Developer',
  },
  {
    userId: 2,
    name: 'Jane',
    surname: 'Smith',
    email: 'jane.smith@company.com',
    department: 'Product',
    role: 'Product Manager',
  },
  {
    userId: 3,
    name: 'Bob',
    surname: 'Johnson',
    email: 'bob.johnson@company.com',
    department: 'Engineering',
    role: 'Frontend Developer',
  },
  {
    userId: 4,
    name: 'Alice',
    surname: 'Brown',
    email: 'alice.brown@company.com',
    department: 'Design',
    role: 'UX Designer',
  },
  {
    userId: 5,
    name: 'Charlie',
    surname: 'Wilson',
    email: 'charlie.wilson@company.com',
    department: 'Engineering',
    role: 'Backend Developer',
  },
  {
    userId: 6,
    name: 'Diana',
    surname: 'Miller',
    email: 'diana.miller@company.com',
    department: 'Marketing',
    role: 'Marketing Manager',
  },
  {
    userId: 7,
    name: 'Eva',
    surname: 'Davis',
    email: 'eva.davis@company.com',
    department: 'HR',
    role: 'HR Specialist',
  },
  {
    userId: 8,
    name: 'Frank',
    surname: 'Garcia',
    email: 'frank.garcia@company.com',
    department: 'Sales',
    role: 'Sales Representative',
  },
];

// Column definitions for employee data
const employeeColumns = [
  { key: 'name', title: 'First Name', width: 100 },
  { key: 'surname', title: 'Last Name', width: 100 },
  { key: 'department', title: 'Department', width: 120 },
  { key: 'role', title: 'Role', width: 150 },
  { key: 'email', title: 'Email', width: 200 },
];

// Mapper configuration
const employeeMapper = {
  getId: (employee: any) => employee.userId,
  getText: (employee: any) => `${employee.name} ${employee.surname}`,
};

const meta: Meta<typeof LookupSelect> = {
  title: 'Components/LookupSelect/Multiple Selection',
  component: LookupSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Multiple selection stories showcasing checkbox-based multi-selection capabilities.',
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic multiple selection
export const BasicMultiple: Story = {
  args: {
    data: employees,
    columns: employeeColumns,
    mapper: employeeMapper,
    mode: 'multiple',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic multiple selection with checkbox functionality. Users can select multiple employees.',
      },
    },
  },
};

// Multiple selection with pre-selected values
export const WithPreselectedValues: Story = {
  args: {
    data: employees,
    columns: employeeColumns,
    mapper: employeeMapper,
    mode: 'multiple',
    returnShape: 'id-text',
    value: [
      { id: 1, text: 'John Doe' },
      { id: 2, text: 'Jane Smith' },
      { id: 3, text: 'Bob Johnson' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple selection with some employees already selected. Shows how selected items are displayed in the trigger.',
      },
    },
  },
};

// Multiple selection returning full row objects
export const MultipleReturnRows: Story = {
  args: {
    data: employees,
    columns: employeeColumns,
    mapper: employeeMapper,
    mode: 'multiple',
    returnShape: 'row',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple selection that returns full employee objects instead of id-text pairs.',
      },
    },
  },
};

// Multiple selection with custom return mapping
export const MultipleCustomReturn: Story = {
  args: {
    data: employees,
    columns: employeeColumns,
    mapper: employeeMapper,
    mode: 'multiple',
    returnShape: 'custom',
    returnMap: {
      map: (employee: any) => ({
        employeeId: employee.userId,
        fullName: `${employee.name} ${employee.surname}`,
        department: employee.department,
        contact: employee.email,
      }),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple selection with custom return shape - returns structured objects with specific fields.',
      },
    },
  },
};

// Multiple selection with custom cell renderers
export const MultipleWithCustomCells: Story = {
  args: {
    data: employees,
    columns: [
      { key: 'name', title: 'First Name', width: 100 },
      { key: 'surname', title: 'Last Name', width: 100 },
      {
        key: 'department',
        title: 'Department',
        width: 120,
        render: (employee: any) => (
          <span
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor:
                employee.department === 'Engineering'
                  ? '#e3f2fd'
                  : employee.department === 'Product'
                    ? '#f3e5f5'
                    : employee.department === 'Design'
                      ? '#e8f5e8'
                      : '#fff3e0',
              fontSize: '12px',
            }}
          >
            {employee.department}
          </span>
        ),
      },
      { key: 'role', title: 'Role', width: 150 },
      { key: 'email', title: 'Email', width: 200 },
    ],
    mapper: employeeMapper,
    mode: 'multiple',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple selection with custom cell renderer for the department column - shows colored badges.',
      },
    },
  },
};

// Large dataset for testing performance
const generateLargeDataset = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    userId: i + 1,
    name: `User${i + 1}`,
    surname: `Surname${i + 1}`,
    email: `user${i + 1}@company.com`,
    department: [
      'Engineering',
      'Product',
      'Design',
      'Marketing',
      'HR',
      'Sales',
    ][i % 6],
    role: `Role ${i + 1}`,
  }));

export const MultipleLargeDataset: Story = {
  args: {
    data: generateLargeDataset(100),
    columns: employeeColumns,
    mapper: employeeMapper,
    mode: 'multiple',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple selection with a large dataset (100 items) to test performance and scrolling behavior.',
      },
    },
  },
};

// Multiple selection with search enabled
export const MultipleWithSearch: Story = {
  args: {
    data: employees,
    columns: employeeColumns,
    mapper: employeeMapper,
    mode: 'multiple',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple selection with search functionality. Users can filter employees by typing in the search box.',
      },
    },
  },
};
