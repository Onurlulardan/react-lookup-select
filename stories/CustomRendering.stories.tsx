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
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Custom rendering examples showcasing custom cell renderers, triggers, and advanced UI customizations.',
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
        story:
          'Product selection with custom cell renderers for images, badges, prices, ratings, and stock status.',
      },
    },
  },
};

// Custom trigger rendering
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
        story:
          'Custom trigger component with shopping cart icon and custom styling.',
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
        story:
          'Multiple product selection with custom return shape for shopping cart-like functionality.',
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
        story:
          'Interactive cells with buttons and actions. Shows event handling within custom cell renderers.',
      },
    },
  },
};
