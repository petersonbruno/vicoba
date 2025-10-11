// components/DataTable.jsx
"use client";
export default function DataTable({ columns = [], rows = [] }) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 text-left text-xs text-gray-500">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td className="px-4 py-6 text-sm text-gray-500" colSpan={columns.length}>No records</td></tr>
          ) : (
            rows.map((r, idx) => (
              <tr key={idx} className="border-t">
                {columns.map((c, i) => <td key={i} className="px-4 py-3 text-sm">{r[c] ?? "-"}</td>)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
