# react-lookup-select

[![NPM Version](https://img.shields.io/npm/v/react-lookup-select.svg)](https://www.npmjs.com/package/react-lookup-select)
[![NPM Downloads](https://img.shields.io/npm/dm/react-lookup-select.svg)](https://www.npmjs.com/package/react-lookup-select)
[![GitHub](https://img.shields.io/github/license/Onurlulardan/react-lookup-select.svg)](https://github.com/Onurlulardan/react-lookup-select)

A headless, customizable React lookup select component with modal and grid support for single/multiple selection.

## Features

- **Trigger (ComboBox appearance)**: Click to open modal
- **Grid inside Modal**: Single/multiple row selection (with checkboxes or row clicks)
- **Selection Modes**: single | multiple
- **Return Values**: id and text fields are user-mappable
- **Full Customization**: themes, icons, grid columns, cell renderers
- **Data Sources**: data (array) or dataSource (async: pagination/sort/search)
- **Accessibility**: keyboard navigation, ARIA roles, focus trap
- **Performance**: virtualization option for large datasets

## Installation

```bash
npm i react-lookup-select
```

```tsx
import { LookupSelect } from 'react-lookup-select';
import 'react-lookup-select/styles.css';
```

## Example Usage

### Single Selection – text = name + ' ' + surname

```tsx
<LookupSelect
  mode="single"
  data={users}
  columns={[
    { key: 'name', title: 'Name' },
    { key: 'surname', title: 'Surname' },
    { key: 'email', title: 'Email' },
  ]}
  mapper={{
    getId: (u) => u.userId,
    getText: (u) => `${u.name} ${u.surname}`,
  }}
  returnShape="id-text"
  onChange={(val) => console.log(val)}
/>
```

### Multiple Selection – Custom return

```tsx
<LookupSelect
  mode="multiple"
  data={products}
  columns={[
    { key: 'sku', title: 'SKU' },
    { key: 'title', title: 'Product' },
    { key: 'price', title: 'Price' },
  ]}
  mapper={{ getId: (p) => p.id, getText: (p) => p.title }}
  returnShape="custom"
  returnMap={{ map: (p) => ({ key: p.id, label: p.title, p }) }}
  onChange={(vals) => save(vals)}
/>
```

### Server-side data + search/pagination

```tsx
const dataSource = async (q: QueryState) => {
  const res = await fetch(
    `/api/users?page=${q.page}&size=${q.pageSize}&search=${q.search ?? ''}`
  );
  const json = await res.json();
  return { rows: json.items, total: json.total };
};

<LookupSelect
  mode="multiple"
  dataSource={dataSource}
  pageSize={50}
  columns={[
    { key: 'name', title: 'Name', sortable: true },
    { key: 'surname', title: 'Surname', sortable: true },
    { key: 'department', title: 'Department' },
  ]}
  mapper={{ getId: (u) => u.id, getText: (u) => `${u.name} ${u.surname}` }}
  onQueryChange={(q) => console.log('query changed', q)}
/>;
```

## Theming and Customization

### Pre-built Themes

```tsx
{
  /* Default theme */
}
<LookupSelect variant="default" {...props} />;

{
  /* Dark theme */
}
<LookupSelect variant="dark" {...props} />;

{
  /* Minimal theme */
}
<LookupSelect variant="minimal" {...props} />;

{
  /* Compact theme */
}
<LookupSelect variant="compact" {...props} />;
```

### Size Options

```tsx
{
  /* Small size */
}
<LookupSelect size="small" {...props} />;

{
  /* Medium size (default) */
}
<LookupSelect size="medium" {...props} />;

{
  /* Large size */
}
<LookupSelect size="large" {...props} />;
```

### Customization with CSS Variables

```tsx
<LookupSelect
  theme={{
    colorPrimary: '#8b5cf6',
    colorBg: '#faf5ff',
    colorText: '#4c1d95',
    borderRadius: 12,
    spacing: 10,
  }}
  {...props}
/>
```

### Customization with CSS Classes

```tsx
<LookupSelect
  classNames={{
    root: 'my-custom-lookup',
    trigger: 'my-custom-trigger',
    modal: 'my-custom-modal',
    grid: 'my-custom-grid',
  }}
  {...props}
/>
```

```css
.my-custom-lookup {
  --lookup-select-color-primary: #10b981;
  --lookup-select-border-radius: 8px;
  --lookup-select-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.my-custom-trigger {
  border: 2px solid #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}
```

### Inline Styles

```tsx
<LookupSelect
  styles={{
    root: { border: '2px solid #f59e0b', borderRadius: '8px' },
    trigger: { background: '#fef3c7', color: '#92400e' },
    modal: { boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
  }}
  {...props}
/>
```

## Virtualization - Large Data Performance

### Auto Virtualization

```tsx
<LookupSelect
  data={largeDataArray} // 1000+ records
  virtualization={true} // Auto-enable when data > 100 items
  {...props}
/>
```

### Manual Virtualization Configuration

```tsx
<LookupSelect
  data={tenThousandItems}
  virtualization={true}
  virtualRowHeight={48} // Fixed row height
  virtualContainerHeight={500} // Scroll container height
  virtualOverscan={10} // Buffer for smooth scrolling
  virtualThreshold={100} // Enable when data exceeds this
  {...props}
/>
```

### Hybrid Mode - Server + Client Virtualization

```tsx
<LookupSelect
  dataSource={serverDataSource}
  virtualization={true}
  pageSize={100} // Fetch 500 records from server (5x buffer)
  virtualContainerHeight={400}
  virtualRowHeight={40}
  {...props}
/>
```

### Performance Comparison

| Data Size   | Virtualization | DOM Elements | Render Time | Memory |
| ----------- | -------------- | ------------ | ----------- | ------ |
| 10,000 item | ❌ Disabled    | 10,000 rows  | ~2000ms     | ~200MB |
| 10,000 item | ✅ Enabled     | ~20 rows     | ~50ms       | ~15MB  |

### Usage Recommendations

- **100+ records:** Auto virtualization
- **1,000+ records:** Client-side virtualization
- **10,000+ records:** Hybrid mode (server + client)
- **100,000+ records:** Pure server pagination

### All CSS Customization Variables

```css
:root {
  /* Colors */
  --lookup-select-color-primary: #0066cc;
  --lookup-select-color-primary-hover: #0052a3;
  --lookup-select-color-bg: #ffffff;
  --lookup-select-color-text: #333333;
  --lookup-select-color-border: #d1d5db;

  /* Layout */
  --lookup-select-border-radius: 6px;
  --lookup-select-spacing: 8px;
  --lookup-select-font-size: 14px;

  /* Component specific sizes */
  --lookup-select-trigger-height: 36px;
  --lookup-select-modal-width: 600px;
  --lookup-select-grid-row-height: 40px;

  /* Shadows */
  --lookup-select-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --lookup-select-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

## License

MIT
