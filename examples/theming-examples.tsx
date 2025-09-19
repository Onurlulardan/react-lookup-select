import React from 'react';
import { LookupSelect } from 'react-lookup-select';

// Example data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
];

const columns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'role', title: 'Role' },
];

const mapper = {
  getId: (user: any) => user.id,
  getText: (user: any) => `${user.name} (${user.email})`,
};

export function ThemingExamples() {
  const [selectedUser, setSelectedUser] = React.useState(null);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px' }}>
      <h1>React Lookup Select - Theming Examples</h1>

      {/* Default Theme */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Default Theme</h2>
        <LookupSelect
          data={users}
          columns={columns}
          mapper={mapper}
          value={selectedUser}
          onChange={setSelectedUser}
        />
      </section>

      {/* Dark Theme */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Dark Theme</h2>
        <div
          style={{
            background: '#1f2937',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <LookupSelect
            variant="dark"
            data={users}
            columns={columns}
            mapper={mapper}
            value={selectedUser}
            onChange={setSelectedUser}
          />
        </div>
      </section>

      {/* Minimal Theme */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Minimal Theme</h2>
        <LookupSelect
          variant="minimal"
          data={users}
          columns={columns}
          mapper={mapper}
          value={selectedUser}
          onChange={setSelectedUser}
        />
      </section>

      {/* Compact Theme */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Compact Theme</h2>
        <LookupSelect
          variant="compact"
          data={users}
          columns={columns}
          mapper={mapper}
          value={selectedUser}
          onChange={setSelectedUser}
        />
      </section>

      {/* Size Variants */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Size Variants</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div>
            <h3>Small</h3>
            <LookupSelect
              size="small"
              data={users}
              columns={columns}
              mapper={mapper}
              value={selectedUser}
              onChange={setSelectedUser}
            />
          </div>
          <div>
            <h3>Medium (Default)</h3>
            <LookupSelect
              size="medium"
              data={users}
              columns={columns}
              mapper={mapper}
              value={selectedUser}
              onChange={setSelectedUser}
            />
          </div>
          <div>
            <h3>Large</h3>
            <LookupSelect
              size="large"
              data={users}
              columns={columns}
              mapper={mapper}
              value={selectedUser}
              onChange={setSelectedUser}
            />
          </div>
        </div>
      </section>

      {/* Custom Theme with CSS Variables */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Custom Theme with CSS Variables</h2>
        <LookupSelect
          data={users}
          columns={columns}
          mapper={mapper}
          value={selectedUser}
          onChange={setSelectedUser}
          theme={{
            colorPrimary: '#8b5cf6',
            colorBg: '#faf5ff',
            colorText: '#4c1d95',
            borderRadius: 12,
            spacing: 10,
          }}
        />
      </section>

      {/* Custom CSS Classes */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Custom CSS Classes</h2>
        <LookupSelect
          data={users}
          columns={columns}
          mapper={mapper}
          value={selectedUser}
          onChange={setSelectedUser}
          classNames={{
            root: 'my-custom-lookup',
            trigger: 'my-custom-trigger',
            modal: 'my-custom-modal',
            grid: 'my-custom-grid',
          }}
        />
      </section>

      {/* Inline Styles */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Inline Styles</h2>
        <LookupSelect
          data={users}
          columns={columns}
          mapper={mapper}
          value={selectedUser}
          onChange={setSelectedUser}
          styles={{
            root: { border: '2px solid #f59e0b', borderRadius: '8px' },
            trigger: { background: '#fef3c7', color: '#92400e' },
            modal: { boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
          }}
        />
      </section>
    </div>
  );
}

// CSS for custom classes example
const customStyles = `
.my-custom-lookup {
  --lookup-select-color-primary: #10b981;
  --lookup-select-border-radius: 8px;
  --lookup-select-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.my-custom-trigger {
  border: 2px solid #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

.my-custom-modal {
  border-radius: 16px;
  overflow: hidden;
}

.my-custom-grid {
  --lookup-select-grid-row-height: 48px;
}
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = customStyles;
  document.head.appendChild(styleEl);
}
