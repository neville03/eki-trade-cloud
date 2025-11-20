type Order = {
  id: string;
  total_amount: number;
  status: string;
  created_at?: string;
};

type OrdersPageProps = {
  orders?: Order[];
  onUpdateStatus?: (id: string, status: string) => void;
};

const OrdersPage = ({
  orders = [],
  onUpdateStatus = () => {},
}: OrdersPageProps) => (
  <section className="space-y-6">
    <h2 className="text-xl font-bold">Orders</h2>
    <div className="bg-white rounded shadow p-6">
      {orders.length === 0 ? (
        <div className="text-gray-500 text-center">No orders yet.</div>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(ord => (
              <tr key={ord.id}>
                <td>{ord.id}</td>
                <td>{ord.created_at ? new Date(ord.created_at).toLocaleString() : ""}</td>
                <td>UGX {ord.total_amount}</td>
                <td>
                  <select value={ord.status} onChange={e => onUpdateStatus(ord.id, e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  {/* Add view or delete if needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </section>
);

export default OrdersPage;
