// components/Topbar.jsx
"use client";
export default function Topbar() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">Welcome back,</span>
          <div className="text-sm font-medium">Admin</div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white hover:bg-gray-50">
            Notifications
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:opacity-95">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
