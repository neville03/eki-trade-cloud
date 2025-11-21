// src/pages/DashboardOverviewPage.tsx

type DashboardStats = {
  totalSales: number;
  pendingOrders: number;
  feedback: number;
  products: number;
  avgOrderValue: number;
  avgProductRating: number;
  responseRate: number;
  totalReviews: number;
  completedOrders: number;
};

type Order = {
  id: string;
  total_price: number;
  status: string;
  created_at?: string;
  customer_id?: string;
  product_id?: string;
  vendor_id?: string;
};

const DashboardOverview = ({
  stats,
  orders,
}: {
  stats: DashboardStats;
  orders: Order[];
}) => {
  return (
    <section>
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-2">Business Overview</h2>
      <div className="text-gray-500 mb-6">
        Welcome back! Here’s what’s happening with your store.
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          label="Total Sales"
          value={`UGX ${stats.totalSales.toLocaleString()}`}
          desc={`from ${orders.length} orders`}
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          desc="Awaiting processing"
        />
        <StatCard
          label="Feedback"
          value={stats.feedback}
          desc="Awaiting response"
        />
        <StatCard
          label="Products"
          value={stats.products}
          desc="In your catalog"
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity stats={stats} />
    </section>
  );
};

// ---- StatCard Component ----
function StatCard({
  label,
  value,
  desc,
}: {
  label: string;
  value: string | number;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex flex-col justify-between min-h-[120px]">
      <div className="text-gray-500 text-xs font-semibold mb-1">{label}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{desc}</div>
    </div>
  );
}

// ---- RecentActivity Component ----
function RecentActivity({ stats }: { stats: DashboardStats }) {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-5">Recent Activity</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-5 flex flex-col justify-between min-h-[120px]">
          <div className="font-medium text-gray-800 mb-2">Order Status</div>
          <div className="flex flex-col gap-1">
            <span className="text-md text-yellow-700">
              {stats.pendingOrders} pending
            </span>
            <span className="text-md text-green-700">
              {stats.completedOrders} completed
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex flex-col justify-between min-h-[120px]">
          <div className="font-medium text-gray-800 mb-2">Customer Feedback</div>
          <div className="flex flex-col gap-1">
            <span className="text-md text-red-700">
              {stats.feedback} need response
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex flex-col justify-between min-h-[120px]">
          <div className="font-medium text-gray-800 mb-2">Product Addition</div>
          <div className="flex flex-col gap-1">
            <span className="text-md text-blue-700">
              {stats.products} products listed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardOverview;
