import type { Meta, StoryObj } from '@storybook/react';
import { createPortal } from 'react-dom';
import { LookupSelect } from '../src/components/LookupSelect';
import '../src/styles.css';

// Mock data with rich information for custom rendering
const products = [
  {
    productId: 1,
    name: 'iPhone 15 Pro',
    category: 'Electronics',
    price: 999,
    rating: 4.8,
    image: 'https://via.placeholder.com/40x40/007ACC/FFFFFF?text=IP',
    brand: 'Apple',
    inStock: true,
    description: 'Latest iPhone with pro camera system',
  },
  {
    productId: 2,
    name: 'MacBook Pro 16"',
    category: 'Electronics',
    price: 2499,
    rating: 4.9,
    image: 'https://via.placeholder.com/40x40/333333/FFFFFF?text=MB',
    brand: 'Apple',
    inStock: false,
    description: 'Professional laptop for developers',
  },
  {
    productId: 3,
    name: 'AirPods Pro',
    category: 'Audio',
    price: 249,
    rating: 4.7,
    image: 'https://via.placeholder.com/40x40/FF6B6B/FFFFFF?text=AP',
    brand: 'Apple',
    inStock: true,
    description: 'Wireless earbuds with noise cancellation',
  },
  {
    productId: 4,
    name: 'Samsung Galaxy S24',
    category: 'Electronics',
    price: 899,
    rating: 4.6,
    image: 'https://via.placeholder.com/40x40/4ECDC4/FFFFFF?text=SG',
    brand: 'Samsung',
    inStock: true,
    description: 'Latest Samsung flagship smartphone',
  },
  {
    productId: 5,
    name: 'Sony WH-1000XM4',
    category: 'Audio',
    price: 349,
    rating: 4.8,
    image: 'https://via.placeholder.com/40x40/45B7D1/FFFFFF?text=SH',
    brand: 'Sony',
    inStock: true,
    description: 'Premium noise-canceling headphones',
  },
];

// Product mapper
const productMapper = {
  getId: (product: any) => product.productId,
  getText: (product: any) => product.name,
};

// Custom cell renderers
const ProductImageCell = ({ row }: { row: any }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <img
      src={row.image}
      alt={row.name}
      style={{ width: 32, height: 32, borderRadius: '4px' }}
    />
    <div>
      <div style={{ fontWeight: 600, fontSize: '14px' }}>{row.name}</div>
      <div style={{ fontSize: '12px', color: '#666' }}>{row.brand}</div>
    </div>
  </div>
);

const PriceCell = ({ row }: { row: any }) => (
  <div style={{ textAlign: 'right', fontWeight: 600 }}>
    ${row.price.toLocaleString()}
  </div>
);

const RatingCell = ({ row }: { row: any }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    <span style={{ color: '#ffa500' }}>★</span>
    <span>{row.rating}</span>
  </div>
);

const StockStatusCell = ({ row }: { row: any }) => (
  <span
    style={{
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 600,
      backgroundColor: row.inStock ? '#e8f5e8' : '#ffe8e8',
      color: row.inStock ? '#2e7d32' : '#c62828',
    }}
  >
    {row.inStock ? 'In Stock' : 'Out of Stock'}
  </span>
);

const CategoryBadgeCell = ({ row }: { row: any }) => (
  <span
    style={{
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      backgroundColor: row.category === 'Electronics' ? '#e3f2fd' : '#f3e5f5',
      color: row.category === 'Electronics' ? '#1976d2' : '#7b1fa2',
    }}
  >
    {row.category}
  </span>
);

// Custom trigger component
const CustomTrigger = (selectedValue: any) => {
  const selectedText = selectedValue
    ? selectedValue.name || productMapper.getText(selectedValue)
    : null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white',
        cursor: 'pointer',
        minWidth: '300px',
        fontSize: '14px',
        transition: 'all 0.2s ease',
      }}
    >
      <span>🛍️</span>
      <span>{selectedText || 'Choose a product...'}</span>
      <span style={{ marginLeft: 'auto', color: '#666' }}>▼</span>
    </div>
  );
};

const meta: Meta<typeof LookupSelect> = {
  title: 'Components/LookupSelect/Custom Rendering',
  component: LookupSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Custom Rendering Examples

This page showcases comprehensive custom rendering capabilities of the LookupSelect component. You can customize:

- **Cell Renderers**: Custom components for table cells with rich content
- **Trigger Component**: Custom trigger button/input design
- **Modal Component**: Complete modal customization with portals
- **Grid Component**: Transform table into cards, lists, or any layout
- **Search Component**: Custom search interfaces with branding
- **Footer Component**: Custom action areas with statistics
- **Header Component**: Custom modal headers and titles
- **Pagination**: Custom pagination controls and navigation
- **Rich Content**: Images, badges, buttons, and interactive elements
- **Theming**: Consistent styling across all components

## Basic Usage

\`\`\`tsx
import { LookupSelect } from 'react-lookup-select';

<LookupSelect
  data={products}
  columns={[
    {
      key: 'name',
      title: 'Product',
      render: (row) => <CustomProductCell row={row} />
    }
  ]}
  mapper={{ getId: (item) => item.id, getText: (item) => item.name }}
  renderTrigger={CustomTrigger}
/>
\`\`\`
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

// Basic custom cell rendering
//
// Example usage:
//
// const ProductImageCell = ({ row }) => (
//   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//     <img src={row.image} alt={row.name} style={{ width: 32, height: 32 }} />
//     <div>
//       <div style={{ fontWeight: 600 }}>{row.name}</div>
//       <div style={{ color: '#666' }}>{row.brand}</div>
//     </div>
//   </div>
// );
//
// <LookupSelect
//   data={products}
//   columns={[
//     {
//       key: 'name',
//       title: 'Product',
//       render: (row) => <ProductImageCell row={row} />,
//     }
//   ]}
//   mapper={productMapper}
// />
export const CustomCells: Story = {
  args: {
    data: products,
    columns: [
      {
        key: 'name',
        title: 'Product',
        width: 200,
        render: (row: any) => <ProductImageCell row={row} />,
      },
      {
        key: 'category',
        title: 'Category',
        width: 100,
        render: (row: any) => <CategoryBadgeCell row={row} />,
      },
      {
        key: 'price',
        title: 'Price',
        width: 100,
        render: (row: any) => <PriceCell row={row} />,
      },
      {
        key: 'rating',
        title: 'Rating',
        width: 80,
        render: (row: any) => <RatingCell row={row} />,
      },
      {
        key: 'inStock',
        title: 'Status',
        width: 100,
        render: (row: any) => <StockStatusCell row={row} />,
      },
    ],
    mapper: productMapper,
    mode: 'single',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story: `
# Custom Cell Renderers

This example shows how to create custom cell renderers for different data types. Each column can have its own custom rendering logic.

## Custom Cell Components

\`\`\`tsx
// Product with image and brand
const ProductImageCell = ({ row }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <img
      src={row.image}
      alt={row.name}
      style={{ width: 32, height: 32, borderRadius: '4px' }}
    />
    <div>
      <div style={{ fontWeight: 600, fontSize: '14px' }}>{row.name}</div>
      <div style={{ fontSize: '12px', color: '#666' }}>{row.brand}</div>
    </div>
  </div>
);

// Price formatting
const PriceCell = ({ row }) => (
  <div style={{ textAlign: 'right', fontWeight: 600 }}>
    \${row.price.toLocaleString()}
  </div>
);

// Rating with stars
const RatingCell = ({ row }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    <span style={{ color: '#ffa500' }}>★</span>
    <span>{row.rating}</span>
  </div>
);

// Stock status badge
const StockStatusCell = ({ row }) => (
  <span
    style={{
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 600,
      backgroundColor: row.inStock ? '#e8f5e8' : '#ffe8e8',
      color: row.inStock ? '#2e7d32' : '#c62828',
    }}
  >
    {row.inStock ? 'In Stock' : 'Out of Stock'}
  </span>
);
\`\`\`

## Usage in LookupSelect

\`\`\`tsx
<LookupSelect
  data={products}
  columns={[
    {
      key: 'name',
      title: 'Product',
      width: 200,
      render: (row) => <ProductImageCell row={row} />,
    },
    {
      key: 'category',
      title: 'Category',
      width: 100,
      render: (row) => <CategoryBadgeCell row={row} />,
    },
    {
      key: 'price',
      title: 'Price',
      width: 100,
      render: (row) => <PriceCell row={row} />,
    },
    {
      key: 'rating',
      title: 'Rating',
      width: 80,
      render: (row) => <RatingCell row={row} />,
    },
    {
      key: 'inStock',
      title: 'Status',
      width: 100,
      render: (row) => <StockStatusCell row={row} />,
    },
  ]}
  mapper={productMapper}
  mode="single"
  returnShape="id-text"
/>
\`\`\`
        `,
      },
    },
  },
};

// Custom trigger rendering
//
// Example usage:
//
// const CustomTrigger = (selectedValue) => {
//   const selectedText = selectedValue?.name || 'Choose a product...';
//   return (
//     <div style={{
//       display: 'flex', alignItems: 'center', gap: '8px',
//       padding: '12px 16px', border: '2px solid #ddd', borderRadius: '8px'
//     }}>
//       <span>🛍️</span>
//       <span>{selectedText}</span>
//       <span style={{ marginLeft: 'auto' }}>▼</span>
//     </div>
//   );
// };
//
// <LookupSelect
//   data={products}
//   columns={columns}
//   mapper={productMapper}
//   renderTrigger={CustomTrigger}  // Use custom trigger
// />
export const CustomTriggerRender: Story = {
  args: {
    data: products,
    columns: [
      { key: 'name', title: 'Product', width: 200 },
      { key: 'category', title: 'Category', width: 100 },
      { key: 'price', title: 'Price', width: 100 },
    ],
    mapper: productMapper,
    mode: 'single',
    returnShape: 'id-text',
    renderTrigger: CustomTrigger,
  },
  parameters: {
    docs: {
      description: {
        story: `
# Custom Trigger Component

This example shows how to create a completely custom trigger component that replaces the default input-like trigger.

## Custom Trigger Implementation

\`\`\`tsx
// Custom trigger component
const CustomTrigger = (selectedValue) => {
  const selectedText = selectedValue
    ? selectedValue.name || productMapper.getText(selectedValue)
    : null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white',
        cursor: 'pointer',
        minWidth: '300px',
        fontSize: '14px',
        transition: 'all 0.2s ease',
      }}
    >
      <span>🛍️</span>
      <span>{selectedText || 'Choose a product...'}</span>
      <span style={{ marginLeft: 'auto', color: '#666' }}>▼</span>
    </div>
  );
};
\`\`\`

## Usage with Custom Trigger

\`\`\`tsx
<LookupSelect
  data={products}
  columns={[
    { key: 'name', title: 'Product', width: 200 },
    { key: 'category', title: 'Category', width: 100 },
    { key: 'price', title: 'Price', width: 100 },
  ]}
  mapper={productMapper}
  mode="single"
  returnShape="id-text"
  renderTrigger={CustomTrigger}  // Use your custom trigger
/>
\`\`\`

## Key Points

- The **renderTrigger** function receives the currently selected value(s)
- Return any React component as the trigger
- The component automatically handles click events and accessibility
- You can access the selected item properties for rich trigger content
        `,
      },
    },
  },
};

// Rich product display
export const RichProductDisplay: Story = {
  args: {
    data: products,
    columns: [
      {
        key: 'name',
        title: 'Product Details',
        width: 300,
        render: (row: any) => (
          <div style={{ display: 'flex', gap: '12px', padding: '8px 0' }}>
            <img
              src={row.image}
              alt={row.name}
              style={{ width: 48, height: 48, borderRadius: '8px' }}
            />
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '16px',
                  marginBottom: '4px',
                }}
              >
                {row.name}
              </div>
              <div
                style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}
              >
                {row.description}
              </div>
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                  ${row.price}
                </span>
                <span style={{ color: '#ffa500', fontSize: '14px' }}>
                  ★ {row.rating}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'category',
        title: 'Category',
        width: 120,
        render: (row: any) => <CategoryBadgeCell row={row} />,
      },
      {
        key: 'inStock',
        title: 'Availability',
        width: 120,
        render: (row: any) => <StockStatusCell row={row} />,
      },
    ],
    mapper: productMapper,
    mode: 'single',
    returnShape: 'row',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Rich product display with detailed information, images, and comprehensive product cards.',
      },
    },
  },
};

// Multiple selection with custom return
//
// Example usage:
//
// const customReturnMap = {
//   map: (product) => ({
//     id: product.productId,
//     name: product.name,
//     price: product.price,
//     available: product.inStock,
//     total: product.price
//   })
// };
//
// <LookupSelect
//   data={products}
//   columns={columns}
//   mapper={productMapper}
//   mode="multiple"
//   returnShape="custom"
//   returnMap={customReturnMap}
//   onChange={(selectedItems) => {
//     // selectedItems = array of custom-shaped objects
//     console.log('Selected:', selectedItems);
//   }}
// />
export const MultipleCustomReturn: Story = {
  args: {
    data: products,
    columns: [
      {
        key: 'name',
        title: 'Product',
        width: 200,
        render: (row: any) => <ProductImageCell row={row} />,
      },
      {
        key: 'price',
        title: 'Price',
        width: 100,
        render: (row: any) => <PriceCell row={row} />,
      },
      {
        key: 'inStock',
        title: 'Status',
        width: 100,
        render: (row: any) => <StockStatusCell row={row} />,
      },
    ],
    mapper: productMapper,
    mode: 'multiple',
    returnShape: 'custom',
    returnMap: {
      map: (product: any) => ({
        id: product.productId,
        name: product.name,
        price: product.price,
        available: product.inStock,
        total: product.price, // This could be calculated based on quantity
      }),
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
# Multiple Selection with Custom Return Shape

This example demonstrates multiple selection mode with a custom return shape, perfect for shopping cart or order management scenarios.

## Custom Return Mapping

\`\`\`tsx
// Define custom return shape
const customReturnMap = {
  map: (product) => ({
    id: product.productId,
    name: product.name,
    price: product.price,
    available: product.inStock,
    total: product.price, // Could calculate quantity * price
  }),
};
\`\`\`

## Multiple Selection Setup

\`\`\`tsx
<LookupSelect
  data={products}
  columns={[
    {
      key: 'name',
      title: 'Product',
      width: 200,
      render: (row) => <ProductImageCell row={row} />,
    },
    {
      key: 'price',
      title: 'Price',
      width: 100,
      render: (row) => <PriceCell row={row} />,
    },
    {
      key: 'inStock',
      title: 'Status',
      width: 100,
      render: (row) => <StockStatusCell row={row} />,
    },
  ]}
  mapper={productMapper}
  mode="multiple"           // Enable multiple selection
  returnShape="custom"      // Use custom return shape
  returnMap={customReturnMap}  // Define how to map selected items
  onChange={(selectedItems) => {
    // selectedItems will be an array of custom-shaped objects
    console.log('Selected:', selectedItems);
    // Example output:
    // [
    //   { id: 1, name: 'iPhone 15 Pro', price: 999, available: true, total: 999 },
    //   { id: 3, name: 'AirPods Pro', price: 249, available: true, total: 249 }
    // ]
  }}
/>
\`\`\`

## Return Shape Options

- **id-text**: \`{ id, text }\` - Simple ID and display text
- **row**: Complete original data object
- **custom**: Custom-mapped object using \`returnMap.map()\`
        `,
      },
    },
  },
};

// Themed custom rendering
export const ThemedCustomRender: Story = {
  args: {
    data: products,
    columns: [
      {
        key: 'name',
        title: 'Product',
        width: 200,
        render: (row: any) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: '6px',
              backgroundColor: '#f8f9fa',
            }}
          >
            <img
              src={row.image}
              alt={row.name}
              style={{ width: 24, height: 24, borderRadius: '50%' }}
            />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>
              {row.name}
            </span>
          </div>
        ),
      },
      {
        key: 'price',
        title: 'Price',
        width: 100,
        render: (row: any) => (
          <div
            style={{
              padding: '4px 8px',
              backgroundColor: '#e8f5e8',
              borderRadius: '4px',
              textAlign: 'center',
              color: '#2e7d32',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            ${row.price}
          </div>
        ),
      },
    ],
    mapper: productMapper,
    mode: 'single',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Themed custom rendering with consistent styling and color schemes across all cells.',
      },
    },
  },
};

// Interactive cells (buttons, links)
//
// Example usage:
//
// const ActionButtonsCell = ({ row }) => (
//   <div style={{ display: 'flex', gap: '8px' }}>
//     <button
//       style={{ padding: '4px 8px', fontSize: '12px' }}
//       onClick={(e) => {
//         e.stopPropagation(); // Prevent row selection
//         alert(`View details for ${row.name}`);
//       }}
//     >
//       View
//     </button>
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         alert(`Added ${row.name} to cart`);
//       }}
//     >
//       Add
//     </button>
//   </div>
// );
//
// <LookupSelect
//   columns={[
//     { key: 'name', title: 'Product' },
//     {
//       key: 'actions',
//       title: 'Actions',
//       render: (row) => <ActionButtonsCell row={row} />
//     }
//   ]}
// />
export const InteractiveCells: Story = {
  args: {
    data: products,
    columns: [
      { key: 'name', title: 'Product', width: 200 },
      {
        key: 'price',
        title: 'Price',
        width: 100,
        render: (row: any) => <PriceCell row={row} />,
      },
      {
        key: 'actions',
        title: 'Quick Actions',
        width: 150,
        render: (row: any) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                alert(`View details for ${row.name}`);
              }}
            >
              View
            </button>
            <button
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                border: '1px solid #007acc',
                borderRadius: '4px',
                backgroundColor: '#007acc',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                alert(`Added ${row.name} to cart`);
              }}
            >
              Add
            </button>
          </div>
        ),
      },
    ],
    mapper: productMapper,
    mode: 'single',
    returnShape: 'id-text',
  },
  parameters: {
    docs: {
      description: {
        story: `
# Interactive Cell Components

This example demonstrates how to add interactive elements like buttons, links, or other clickable components within table cells.

## Interactive Cell Implementation

\`\`\`tsx
// Cell with interactive buttons
const ActionButtonsCell = ({ row }) => (
  <div style={{ display: 'flex', gap: '8px' }}>
    <button
      style={{
        padding: '4px 8px',
        fontSize: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: 'pointer',
      }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent row selection
        alert(\`View details for \${row.name}\`);
      }}
    >
      View
    </button>
    <button
      style={{
        padding: '4px 8px',
        fontSize: '12px',
        border: '1px solid #007acc',
        borderRadius: '4px',
        backgroundColor: '#007acc',
        color: 'white',
        cursor: 'pointer',
      }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent row selection
        alert(\`Added \${row.name} to cart\`);
      }}
    >
      Add
    </button>
  </div>
);
\`\`\`

## Usage with Interactive Cells

\`\`\`tsx
<LookupSelect
  data={products}
  columns={[
    { key: 'name', title: 'Product', width: 200 },
    {
      key: 'price',
      title: 'Price',
      width: 100,
      render: (row) => <PriceCell row={row} />,
    },
    {
      key: 'actions',
      title: 'Quick Actions',
      width: 150,
      render: (row) => <ActionButtonsCell row={row} />,
    },
  ]}
  mapper={productMapper}
  mode="single"
  returnShape="id-text"
/>
\`\`\`

## Important Notes

1. **Event Propagation**: Use \`e.stopPropagation()\` in button click handlers to prevent row selection
2. **Accessibility**: Add proper \`aria-label\` attributes for screen readers
3. **Styling**: Interactive elements should have hover and focus states
4. **Event Handling**: Button clicks won't interfere with the lookup selection logic
        `,
      },
    },
  },
};

// ========================================
// RENDER PROPS EXAMPLES
// ========================================

// Team member data for render props examples
const teamMembers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    avatar: '👨‍💼',
    department: 'Engineering',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Designer',
    avatar: '👩‍🎨',
    department: 'Design',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'Developer',
    avatar: '👨‍💻',
    department: 'Engineering',
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'Manager',
    avatar: '👩‍💼',
    department: 'Product',
  },
  {
    id: 5,
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'QA Engineer',
    avatar: '🧑‍🔬',
    department: 'Quality',
  },
];

const teamColumns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'role', title: 'Role' },
  { key: 'department', title: 'Department' },
];

const teamMapper = {
  getId: (member: any) => member.id,
  getText: (member: any) => `${member.name} (${member.role})`,
};

// Custom Modal - Complete UI Transformation
export const CustomModalExample: Story = {
  args: {
    data: teamMembers,
    columns: teamColumns,
    mapper: teamMapper,
    mode: 'single',
    renderModal: ({ isOpen, onClose, children, title, selectedCount }) => {
      if (!isOpen) return null;

      return createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            backdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '0',
              width: '90%',
              maxWidth: '800px',
              minWidth: '600px',
              maxHeight: '85vh',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Custom Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px',
                color: 'white',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h2
                    style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}
                  >
                    👥 {title}
                  </h2>
                  <p
                    style={{
                      margin: '8px 0 0 0',
                      opacity: 0.9,
                      fontSize: '14px',
                    }}
                  >
                    Select team members for your project
                  </p>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    color: 'white',
                    fontSize: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.3)')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.2)')
                  }
                >
                  ✕
                </button>
              </div>
              {selectedCount > 0 && (
                <div
                  style={{
                    marginTop: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    display: 'inline-block',
                  }}
                >
                  📊 {selectedCount} member{selectedCount !== 1 ? 's' : ''}{' '}
                  selected
                </div>
              )}
            </div>

            {/* Content */}
            <div
              style={{ flex: 1, width: '100%', minWidth: 0, overflow: 'auto' }}
            >
              {children}
            </div>
          </div>
        </div>,
        document.body
      );
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
# Custom Modal Rendering

A fully customized modal that transforms the entire user experience. Features:

- **Full-screen overlay** with backdrop blur effects
- **Gradient header** with brand colors and custom styling
- **Selection counter** showing real-time progress
- **Portal rendering** for perfect z-index control
- **Interactive animations** and smooth transitions
- **Professional design** suitable for production apps

## Implementation

\`\`\`tsx
import { createPortal } from 'react-dom';

renderModal: ({ isOpen, onClose, children, title, selectedCount }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="custom-header">
          <h2>{title}</h2>
          {selectedCount > 0 && <span>{selectedCount} selected</span>}
          <button onClick={onClose}>✕</button>
        </div>
        <div className="custom-content">
          {children}
        </div>
      </div>
    </div>,
    document.body // Render to body, not iframe
  );
}
\`\`\`
        `,
      },
    },
  },
};

// Custom Grid with Card Layout
export const CustomGridCards: Story = {
  args: {
    data: teamMembers,
    columns: teamColumns,
    mapper: teamMapper,
    mode: 'multiple',
    renderGrid: ({ data, selectedIds, onRowSelect, mode, mapper }) => (
      <div style={{ padding: '24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: '8px',
          }}
        >
          {data.map((member: any) => {
            const isSelected = selectedIds.includes(mapper.getId(member));
            return (
              <div
                key={mapper.getId(member)}
                onClick={() => onRowSelect(member)}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: isSelected
                    ? '2px solid #667eea'
                    : '1px solid #e5e7eb',
                  backgroundColor: isSelected ? '#f8faff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected
                    ? '0 8px 25px rgba(102, 126, 234, 0.15)'
                    : '0 2px 4px rgba(0, 0, 0, 0.05)',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  position: 'relative',
                }}
                onMouseOver={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.boxShadow =
                      '0 2px 4px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    ✓
                  </div>
                )}

                {/* Avatar and basic info */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2.5rem',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: '600',
                        fontSize: '16px',
                        color: isSelected ? '#1e40af' : '#111827',
                        marginBottom: '2px',
                      }}
                    >
                      {member.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {member.role}
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '4px',
                    }}
                  >
                    <span>📧</span>
                    {member.email}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🏢</span>
                    {member.department}
                  </div>
                </div>

                {/* Department badge */}
                <div
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    padding: '4px 8px',
                    backgroundColor: isSelected ? '#dbeafe' : '#f3f4f6',
                    color: isSelected ? '#1e40af' : '#374151',
                    borderRadius: '12px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {member.department}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: `
# Custom Grid with Card Layout

Transform the default table grid into beautiful card-based layout with rich member information.

## Features

- **Card-based layout** instead of table rows
- **Hover effects** with smooth transitions
- **Selection indicators** with checkmarks
- **Rich member info** with avatars, contact details
- **Responsive grid** that adapts to container width

## Implementation

\`\`\`tsx
renderGrid: ({ data, selectedIds, onRowSelect, mapper }) => (
  <div style={{ padding: '24px' }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px'
    }}>
      {data.map((member) => {
        const isSelected = selectedIds.includes(mapper.getId(member));
        return (
          <div
            key={mapper.getId(member)}
            onClick={() => onRowSelect(member)}
            style={{
              padding: '20px',
              borderRadius: '12px',
              border: isSelected ? '2px solid #667eea' : '1px solid #e5e7eb',
              backgroundColor: isSelected ? '#f8faff' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Card content */}
          </div>
        );
      })}
    </div>
  </div>
)
\`\`\`
        `,
      },
    },
  },
};

// Complete Custom Experience - All render props combined
export const CompleteCustomExperience: Story = {
  args: {
    data: teamMembers,
    columns: teamColumns,
    mapper: teamMapper,
    mode: 'multiple',

    // Custom Modal
    renderModal: ({ isOpen, onClose, children, selectedCount }) => {
      if (!isOpen) return null;
      return createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            backdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              maxWidth: '900px',
              width: '95%',
              maxHeight: '90vh',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>,
        document.body
      );
    },

    // Custom Search
    renderSearch: ({ value, onChange, placeholder }) => (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          color: 'white',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2
            style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}
          >
            👥 Build Your Team
          </h2>
          <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
            Select the perfect team members for your project
          </p>
        </div>

        <div
          style={{
            position: 'relative',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '16px 24px',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              outline: 'none',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '20px',
              color: '#667eea',
            }}
          >
            🔍
          </div>
        </div>
      </div>
    ),

    // Custom Grid
    renderGrid: ({ data, selectedIds, onRowSelect, mapper }) => (
      <div style={{ padding: '32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            maxHeight: '450px',
            overflowY: 'auto',
            paddingRight: '10px',
          }}
        >
          {data.map((member: any) => {
            const isSelected = selectedIds.includes(mapper.getId(member));
            return (
              <div
                key={mapper.getId(member)}
                onClick={() => onRowSelect(member)}
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  border: isSelected
                    ? '3px solid #667eea'
                    : '2px solid #f1f5f9',
                  backgroundColor: isSelected ? '#f8faff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected
                    ? '0 12px 40px rgba(102, 126, 234, 0.2)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  position: 'relative',
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                    }}
                  >
                    ✓
                  </div>
                )}

                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '4rem',
                      marginBottom: '16px',
                      filter: isSelected ? 'none' : 'grayscale(0.3)',
                    }}
                  >
                    {member.avatar}
                  </div>

                  <h3
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '20px',
                      fontWeight: '600',
                      color: isSelected ? '#1e40af' : '#1f2937',
                    }}
                  >
                    {member.name}
                  </h3>

                  <div
                    style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '12px',
                    }}
                  >
                    {member.role} • {member.department}
                  </div>

                  <div
                    style={{
                      fontSize: '13px',
                      color: '#9ca3af',
                      backgroundColor: '#f9fafb',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      display: 'inline-block',
                    }}
                  >
                    {member.email}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),

    // Custom Footer
    renderFooter: ({ selectedCount, onConfirm, onCancel }) => (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '24px 32px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}
          >
            🎉 Team Selection Complete
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            {selectedCount > 0
              ? `${selectedCount} talented team member${selectedCount !== 1 ? 's' : ''} ready to join!`
              : 'Select team members to get started'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.6)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s',
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={selectedCount === 0}
            style={{
              backgroundColor:
                selectedCount > 0 ? 'white' : 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              color: selectedCount > 0 ? '#667eea' : 'rgba(255, 255, 255, 0.7)',
              padding: '12px 32px',
              borderRadius: '25px',
              cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '700',
              transition: 'all 0.2s',
              boxShadow:
                selectedCount > 0 ? '0 8px 24px rgba(0, 0, 0, 0.15)' : 'none',
            }}
          >
            🚀 Launch Team ({selectedCount})
          </button>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: `
# Complete Custom Experience

The ultimate example combining all render props to create a fully customized team selection experience.

## What's Included

- **🎨 Custom Modal**: Full-screen portal with backdrop blur
- **🔍 Custom Search**: Hero-style search with gradient background  
- **👥 Custom Grid**: Card-based member selection with animations
- **📊 Custom Footer**: Statistics and call-to-action buttons

## Key Features

- **Portal rendering** escapes iframe constraints
- **Gradient themes** create visual hierarchy
- **Smooth animations** enhance user experience
- **Responsive design** works on all screen sizes
- **Accessibility** maintained throughout customization

This example shows how render props can transform a simple table selection into a rich, branded user experience perfect for team management applications.
        `,
      },
    },
  },
};
