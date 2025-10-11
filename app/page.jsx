import { Users, CreditCard, Wallet, TrendingUp } from "lucide-react";
import DashboardCard from "./components/DashboardCard";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Members" value="320" color="primary" icon={<Users size={22} />} />
        <DashboardCard title="Active Loans" value="45" color="secondary" icon={<CreditCard size={22} />} />
        <DashboardCard title="Savings" value="TZS 8.2M" color="success" icon={<Wallet size={22} />} />
        <DashboardCard title="Revenue Growth" value="+14%" color="warning" icon={<TrendingUp size={22} />} />
      </div>

      {/* Chart + Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Contributions</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            (Chart will go here)
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Members</h3>
          <ul className="divide-y divide-gray-100">
            {["Aloyce Peter", "Jane Mushi", "Peterson Bruno", "Mary John"].map((name) => (
              <li key={name} className="py-3 flex justify-between text-gray-700">
                <span>{name}</span>
                <span className="text-sm text-gray-500">Joined today</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
