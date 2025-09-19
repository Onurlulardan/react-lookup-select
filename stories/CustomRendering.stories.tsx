import type { Meta, StoryObj } from '@storybook/react';
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

This page showcases various custom rendering capabilities of the LookupSelect component. You can customize:

- **Cell Renderers**: Custom components for table cells
- **Trigger Component**: Custom trigger button/input design
- **Rich Content**: Images, badges, buttons, and interactive elements
- **Theming**: Consistent styling across all elements

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
