import type { Customer } from '@/lib/api';

export function formatDate(value: string): string {
  return new Date(value).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function CustomerTable({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) return <p className="admin-empty">No customers found.</p>;
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Signs in with</th>
            <th scope="col">Joined</th>
            <th scope="col">Last updated</th>
            <th scope="col">Customer ID</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td data-label="Name">
                <strong>{customer.name}</strong>
              </td>
              <td data-label="Email" className="wrap">{customer.email}</td>
              <td data-label="Signs in with">
                <span className="pill plain">{customer.signIn}</span>
              </td>
              <td data-label="Joined">{formatDate(customer.createdAt)}</td>
              <td data-label="Last updated">{formatDate(customer.updatedAt)}</td>
              <td data-label="Customer ID" className="wrap id-cell">{customer.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
