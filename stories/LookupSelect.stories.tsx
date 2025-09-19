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
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# LookupSelect Component

A headless, customizable React lookup select component with modal and grid support for single and multiple selections.

## Features

- **Single & Multiple Selection**: Choose between single item or multiple items selection
- **Return Shapes**: Get selected data as id-text pairs, full objects, or custom mapped objects
- **Modal Interface**: Clean modal popup with search and pagination
- **TypeScript Support**: Full type safety with TypeScript definitions

## Basic Usage

\`\`\`tsx
import { LookupSelect } from '@onurlulardan/react-lookup-select';

const users = [
  { userId: 1, name: 'John', surname: 'Doe', email: 'john@example.com' },
  { userId: 2, name: 'Jane', surname: 'Smith', email: 'jane@example.com' }
];

const columns = [
  { key: 'name', title: 'Name' },
  { key: 'surname', title: 'Surname' },
  { key: 'email', title: 'Email' }
];

const mapper = {
  getId: (user) => user.userId,
  getText: (user) => \`\${user.name} \${user.surname}\`
};

<LookupSelect
  data={users}
  columns={columns}
  mapper={mapper}
  mode="single"
  returnShape="id-text"
  onChange={(selected) => console.log('Selected:', selected)}
/>
\`\`\`

## Props Overview

- **data**: Array of objects to display
- **columns**: Column definitions for the grid
- **mapper**: Functions to extract ID and display text
- **mode**: 'single' or 'multiple' selection
- **returnShape**: 'id-text', 'row', or 'custom'
        `,
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

// Basic single selection
//
// Example usage:
//
// import { LookupSelect } from '@onurlulardan/react-lookup-select';
//
// const users = [
//   { userId: 1, name: 'John', surname: 'Doe', email: 'john@example.com' },
//   { userId: 2, name: 'Jane', surname: 'Smith', email: 'jane@example.com' }
// ];
//
// const columns = [
//   { key: 'name', title: 'Name' },
//   { key: 'surname', title: 'Surname' },
//   { key: 'email', title: 'Email' }
// ];
//
// const mapper = {
//   getId: (user) => user.userId,
//   getText: (user) => `${user.name} ${user.surname}`
// };
//
// <LookupSelect
//   data={users}
//   columns={columns}
//   mapper={mapper}
//   mode="single"
//   returnShape="id-text"
//   onChange={(selected) => console.log('Selected:', selected)}
// />
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
//
// Example usage:
//
// <LookupSelect
//   data={users}
//   columns={columns}
//   mapper={mapper}
//   mode="single"
//   returnShape="id-text"
//   value={{ id: 1, text: 'John Doe' }}  // Pre-selected value
//   onChange={(selected) => {
//     console.log('New selection:', selected);
//   }}
// />
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
//
// Example usage:
//
// <LookupSelect
//   data={users}
//   columns={columns}
//   mapper={mapper}
//   mode="single"
//   returnShape="row"  // Returns the full user object
//   onChange={(selected) => {
//     // selected = { userId: 1, name: 'John', surname: 'Doe', email: 'john@example.com' }
//     console.log('Full user object:', selected);
//     console.log('User email:', selected.email);
//   }}
// />
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
//
// Example usage:
//
// const customReturnMap = {
//   map: (user) => ({
//     id: user.userId,
//     fullName: `${user.name} ${user.surname}`,
//     contact: user.email,
//     displayName: `${user.name} (${user.age} years old)`
//   })
// };
//
// <LookupSelect
//   data={users}
//   columns={columns}
//   mapper={mapper}
//   mode="single"
//   returnShape="custom"
//   returnMap={customReturnMap}
//   onChange={(selected) => {
//     // selected = { id: 1, fullName: 'John Doe', contact: 'john@example.com', displayName: 'John (28 years old)' }
//     console.log('Custom shaped object:', selected);
//   }}
// />
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
