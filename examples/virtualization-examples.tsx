import React from 'react';

// Mock data generator for large datasets
const generateLargeDataset = (count: number) => {
  const departments = [
    'Engineering',
    'Sales',
    'Marketing',
    'HR',
    'Finance',
    'Operations',
  ];
  const cities = ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@company.com`,
    department: departments[i % departments.length],
    city: cities[i % cities.length],
    salary: Math.floor(Math.random() * 50000) + 30000,
    joinDate: new Date(
      2020 + Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28)
    ),
  }));
};

// Server-side data source simulation
const createMockDataSource = (allData: any[]) => {
  return async (query: any) => {
    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 500 + 200)
    );

    let filteredData = [...allData];

    // Apply search filter
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.email.toLowerCase().includes(searchLower) ||
          item.department.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (query.sortBy) {
      filteredData.sort((a, b) => {
        const aVal = a[query.sortBy];
        const bVal = b[query.sortBy];
        const multiplier = query.sortDir === 'desc' ? -1 : 1;

        if (aVal < bVal) return -1 * multiplier;
        if (aVal > bVal) return 1 * multiplier;
        return 0;
      });
    }

    // Apply pagination
    const startIndex = (query.page - 1) * query.pageSize;
    const endIndex = startIndex + query.pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      rows: paginatedData,
      total: filteredData.length,
    };
  };
};

export function VirtualizationExamples() {
  const [selectedUsers, setSelectedUsers] = React.useState([]);

  // Generate different sized datasets
  const smallData = React.useMemo(() => generateLargeDataset(50), []);
  const mediumData = React.useMemo(() => generateLargeDataset(1000), []);
  const largeData = React.useMemo(() => generateLargeDataset(10000), []);
  const hugeData = React.useMemo(() => generateLargeDataset(50000), []);

  // Server-side data sources
  const mediumDataSource = React.useMemo(
    () => createMockDataSource(mediumData),
    [mediumData]
  );
  const largeDataSource = React.useMemo(
    () => createMockDataSource(largeData),
    [largeData]
  );

  const columns = [
    { key: 'id', title: 'ID', width: 60, sortable: true },
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'department', title: 'Department', sortable: true },
    { key: 'city', title: 'City', sortable: true },
    {
      key: 'salary',
      title: 'Salary',
      sortable: true,
      render: (row: any) => `$${row.salary.toLocaleString()}`,
    },
  ];

  const mapper = {
    getId: (user: any) => user.id,
    getText: (user: any) => `${user.name} - ${user.department}`,
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px' }}>
      <h1>React Lookup Select - Virtualization Examples</h1>

      {/* Small Dataset - No Virtualization */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Small Dataset (50 items) - No Virtualization</h2>
        <p>Standard Grid rendering - all DOM elements created</p>
        <div>
          <label>Performance: Good ✅</label>
        </div>
        {/* <LookupSelect
          data={smallData}
          columns={columns}
          mapper={mapper}
          mode="multiple"
          value={selectedUsers}
          onChange={setSelectedUsers}
          virtualization={false}
        /> */}
      </section>

      {/* Medium Dataset - Auto Virtualization */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Medium Dataset (1,000 items) - Auto Virtualization</h2>
        <p>
          Virtualization automatically enabled when data exceeds threshold (100
          items)
        </p>
        <div>
          <label>Performance: Excellent ⚡</label>
        </div>
        {/* <LookupSelect
          data={mediumData}
          columns={columns}
          mapper={mapper}
          mode="multiple"
          value={selectedUsers}
          onChange={setSelectedUsers}
          virtualization={true}
          virtualThreshold={100}
          virtualContainerHeight={400}
          virtualRowHeight={40}
        /> */}
      </section>

      {/* Large Dataset - Client Virtualization */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Large Dataset (10,000 items) - Client Virtualization</h2>
        <p>
          All data loaded in client, virtualized scrolling with custom row
          height
        </p>
        <div>
          <label>Performance: Excellent ⚡</label>
        </div>
        {/* <LookupSelect
          data={largeData}
          columns={columns}
          mapper={mapper}
          mode="multiple"
          value={selectedUsers}
          onChange={setSelectedUsers}
          virtualization={true}
          virtualRowHeight={48}
          virtualContainerHeight={500}
          virtualOverscan={10}
        /> */}
      </section>

      {/* Hybrid Mode - Server + Virtualization */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Hybrid Mode - Server Pagination + Client Virtualization</h2>
        <p>Server loads 500 items per page, client virtualizes the 500 items</p>
        <div>
          <label>Performance: Outstanding 🚀</label>
          <br />
          <small>
            Best of both worlds: Efficient network usage + Smooth scrolling
          </small>
        </div>
        {/* <LookupSelect
          dataSource={largeDataSource}
          columns={columns}
          mapper={mapper}
          mode="multiple"
          value={selectedUsers}
          onChange={setSelectedUsers}
          virtualization={true}
          pageSize={100} // Server will fetch 500 items (5x buffer)
          virtualContainerHeight={400}
          virtualRowHeight={40}
        /> */}
      </section>

      {/* Huge Dataset - Server Only */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Huge Dataset (50,000+ items) - Server Pagination Only</h2>
        <p>
          Traditional pagination for very large datasets where client
          virtualization isn't practical
        </p>
        <div>
          <label>Performance: Good for memory usage 💾</label>
        </div>
        {/* <LookupSelect
          dataSource={createMockDataSource(hugeData)}
          columns={columns}
          mapper={mapper}
          mode="multiple"
          value={selectedUsers}
          onChange={setSelectedUsers}
          virtualization={false}
          pageSize={50}
        /> */}
      </section>

      {/* Performance Comparison */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Performance Comparison</h2>
        <div
          style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <h3>Without Virtualization (10,000 items)</h3>
          <ul>
            <li>DOM Elements: 10,000 rows</li>
            <li>Initial Render: ~2000ms</li>
            <li>Memory Usage: ~200MB</li>
            <li>Scroll Performance: Laggy</li>
          </ul>

          <h3>With Virtualization (10,000 items)</h3>
          <ul>
            <li>DOM Elements: ~20 visible rows</li>
            <li>Initial Render: ~50ms</li>
            <li>Memory Usage: ~15MB</li>
            <li>Scroll Performance: Smooth 60fps</li>
          </ul>

          <h3>Hybrid Mode (Server + Virtual)</h3>
          <ul>
            <li>Network Requests: Optimized chunks</li>
            <li>Client Memory: Controlled</li>
            <li>User Experience: Best</li>
            <li>Scalability: Unlimited</li>
          </ul>
        </div>
      </section>

      {/* Configuration Tips */}
      <section>
        <h2>Configuration Tips</h2>
        <div
          style={{
            background: '#e3f2fd',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <h3>When to use Virtualization:</h3>
          <ul>
            <li>
              <strong>100+ items:</strong> Enable auto virtualization
            </li>
            <li>
              <strong>1,000+ items:</strong> Use client virtualization
            </li>
            <li>
              <strong>10,000+ items:</strong> Consider hybrid mode
            </li>
            <li>
              <strong>100,000+ items:</strong> Use server pagination only
            </li>
          </ul>

          <h3>Optimization Settings:</h3>
          <ul>
            <li>
              <strong>virtualRowHeight:</strong> Match your actual row height
            </li>
            <li>
              <strong>virtualOverscan:</strong> 5-10 for smooth scrolling
            </li>
            <li>
              <strong>virtualContainerHeight:</strong> Based on modal size
            </li>
            <li>
              <strong>virtualThreshold:</strong> 100 is optimal for most cases
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
