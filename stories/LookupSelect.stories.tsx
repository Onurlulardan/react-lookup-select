import type { Meta, StoryObj } from '@storybook/react';
import { LookupSelect } from '../src/components/LookupSelect';
import '../src/styles.css';

// Mock data
const users = [
  {
    userId: 1,
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    age: 28,
  },
  {
    userId: 2,
    name: 'Jane',
    surname: 'Smith',
    email: 'jane.smith@example.com',
    age: 32,
  },
  {
    userId: 3,
    name: 'Bob',
    surname: 'Johnson',
    email: 'bob.johnson@example.com',
    age: 25,
  },
  {
    userId: 4,
    name: 'Alice',
    surname: 'Brown',
    email: 'alice.brown@example.com',
    age: 30,
  },
  {
    userId: 5,
    name: 'Charlie',
    surname: 'Wilson',
    email: 'charlie.wilson@example.com',
    age: 35,
  },
];

// Column definitions
const columns = [
  { key: 'name', title: 'Name' },
  { key: 'surname', title: 'Surname' },
  { key: 'email', title: 'Email' },
  { key: 'age', title: 'Age' },
];

// Mapper configuration
const mapper = {
  getId: (user: any) => user.userId,
  getText: (user: any) => `${user.name} ${user.surname}`,
};

const meta: Meta<typeof LookupSelect> = {
  title: 'Components/LookupSelect',
  component: LookupSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A headless, customizable React lookup select component with modal and grid support for single and multiple selections.',
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

// Basic single selection story
export const BasicSingle: Story = {
  args: {
    data: users,
    columns,
    mapper,
    mode: 'single',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic single selection with id-text return shape.',
      },
    },
  },
};

// With default value
export const WithDefaultValue: Story = {
  args: {
    data: users,
    columns,
    mapper,
    mode: 'single',
    returnShape: 'id-text',
    value: { id: 1, text: 'John Doe' },
  },
  parameters: {
    docs: {
      description: {
        story: 'Single selection with a pre-selected value.',
      },
    },
  },
};

// Return row shape
export const ReturnRowShape: Story = {
  args: {
    data: users,
    columns,
    mapper,
    mode: 'single',
    returnShape: 'row',
  },
  parameters: {
    docs: {
      description: {
        story: 'Single selection returning the full row object.',
      },
    },
  },
};

// Custom return shape
export const CustomReturnShape: Story = {
  args: {
    data: users,
    columns,
    mapper,
    mode: 'single',
    returnShape: 'custom',
    returnMap: {
      map: (user: any) => ({
        fullName: `${user.name} ${user.surname}`,
        contact: user.email,
        age: user.age,
      }),
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Single selection with custom return shape mapping.',
      },
    },
  },
};
