"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function WeeklyReportsPage() {
  const [reports, setReports] = useState([]);
  const [filteredWeek, setFilteredWeek] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  // local editable state keyed by report id
  const [editState, setEditState] = useState({});

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/members/weekly-reports/");
      setReports(res.data || []);
      // initialize edit state for each report
      const initial = {};
      (res.data || []).forEach((r) => {
        initial[r.id] = {
          Adhabu: r.Adhabu ?? 0,
          Mapato_mengineyo: r.Mapato_mengineyo ?? 0,
          Mkopo_toka_nje: r.Mkopo_toka_nje ?? 0,
        };
      });
      setEditState(initial);
    } catch (err) {
      console.error("Failed to load weekly reports:", err);
      setError("Failed to load weekly reports.");
    } finally {
      setLoading(false);
    }
  }

  const uniqueWeeks = Array.from(
    new Set(reports.map((r) => r.week_number))
  ).sort((a, b) => a - b);

  const displayed = filteredWeek
    ? reports.filter((r) => String(r.week_number) === String(filteredWeek))
    : reports;

  function handleEditChange(reportId, field, value) {
    setEditState((prev) => ({
      ...prev,
      [reportId]: {
        ...prev[reportId],
        [field]: value,
      },
    }));
  }

  async function handleSave(report) {
    const id = report.id;
    setSavingId(id);
    setError("");
    try {
      const payload = {
        // send back all required fields to avoid partial-update issues
        week_number: report.week_number,
        Mahudhurio: report.Mahudhurio,
        Hisa: report.Hisa,
        Afya: report.Afya,
        Jamii: report.Jamii,
        Uendeshaji: report.Uendeshaji,
        Adhabu: Number(editState[id]?.Adhabu || 0),
        Bima: report.Bima ?? 0,
        Nyongeza_ya_mkopo: report.Nyongeza_ya_mkopo ?? 0,
        Mapato_mengineyo: Number(editState[id]?.Mapato_mengineyo || 0),
        Mkopo_toka_nje: Number(editState[id]?.Mkopo_toka_nje || 0),
        Hisa_zilizokatwa: report.Hisa_zilizokatwa ?? 0,
        Matumizi: report.Matumizi ?? 0,
        // Jumla_ya_mapato_ya_wiki and Salio will be recalculated by backend/save logic
      };

      console.log("PUT payload for report", id, payload);

      const res = await axios.put(`/api/weekly-reports/${id}/`, payload);
      // update local list with returned data
      setReports((prev) => prev.map((r) => (r.id === id ? res.data : r)));
      // refresh edit state from response
      setEditState((prev) => ({
        ...prev,
        [id]: {
          Adhabu: res.data.Adhabu ?? 0,
          Mapato_mengineyo: res.data.Mapato_mengineyo ?? 0,
          Mkopo_toka_nje: res.data.Mkopo_toka_nje ?? 0,
        },
      }));
    } catch (err) {
      console.error("Failed to save report:", err);
      setError("Failed to save report. Check console for details.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Weekly Reports</h1>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Filter by week:</label>
            <select
              value={filteredWeek}
              onChange={(e) => setFilteredWeek(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="">All Weeks</option>
              {uniqueWeeks.map((w) => (
                <option key={w} value={w}>
                  Week {w}
                </option>
              ))}
            </select>

            <button
              onClick={fetchReports}
              className="ml-2 bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-600 font-medium">{error}</div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Week</th>
                <th className="p-3 border">Mahudhurio</th>
                <th className="p-3 border">Hisa</th>
                <th className="p-3 border">Afya</th>
                <th className="p-3 border">Jamii</th>
                <th className="p-3 border">Uendeshaji</th>
                <th className="p-3 border">Adhabu</th>
                <th className="p-3 border">Bima</th>
                <th className="p-3 border">Nyongeza Mkopo</th>
                <th className="p-3 border">Mapato Mengineyo</th>
                <th className="p-3 border">Mkopo toka nje</th>
                <th className="p-3 border">Jumla ya Mapato</th>
                <th className="p-3 border">Hisa Zilizokatwa</th>
                <th className="p-3 border">Matumizi</th>
                <th className="p-3 border">Salio</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="16" className="p-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : displayed.length === 0 ? (
                <tr>
                  <td colSpan="16" className="p-6 text-center text-gray-500">
                    No reports found.
                  </td>
                </tr>
              ) : (
                displayed.map((r) => {
                  const edit = editState[r.id] || {
                    Adhabu: 0,
                    Mapato_mengineyo: 0,
                    Mkopo_toka_nje: 0,
                  };

                  // Calculate display total (note: backend authoritative)
                  const jumla_mapato =
                    (r.Hisa || 0) +
                    (r.Afya || 0) +
                    (r.Jamii || 0) +
                    (r.Uendeshaji || 0) +
                    Number(edit.Adhabu || 0) +
                    (r.Bima || 0) +
                    (r.Nyongeza_ya_mkopo || 0) +
                    Number(edit.Mapato_mengineyo || 0) +
                    Number(edit.Mkopo_toka_nje || 0);

                  const matumizi = (r.Hisa_zilizokatwa || 0) + (r.Matumizi || 0);
                  const salio = jumla_mapato - matumizi;

                  return (
                    <tr key={r.id} className="even:bg-white odd:bg-gray-50">
                      <td className="p-2 border text-center">{r.week_number}</td>
                      <td className="p-2 border text-right">{Number(r.Mahudhurio || 0).toLocaleString()}</td>
                      <td className="p-2 border text-right">{Number(r.Hisa || 0).toLocaleString()}</td>
                      <td className="p-2 border text-right">{Number(r.Afya || 0).toLocaleString()}</td>
                      <td className="p-2 border text-right">{Number(r.Jamii || 0).toLocaleString()}</td>
                      <td className="p-2 border text-right">{Number(r.Uendeshaji || 0).toLocaleString()}</td>

                      {/* editable fields */}
                      <td className="p-2 border text-right">
                        <input
                          type="number"
                          value={edit.Adhabu}
                          onChange={(e) => handleEditChange(r.id, "Adhabu", e.target.value)}
                          className="w-28 text-right border rounded px-2 py-1"
                        />
                      </td>

                      <td className="p-2 border text-right">{Number(r.Bima || 0).toLocaleString()}</td>

                      <td className="p-2 border text-right">{Number(r.Nyongeza_ya_mkopo || 0).toLocaleString()}</td>

                      <td className="p-2 border text-right">
                        <input
                          type="number"
                          value={edit.Mapato_mengineyo}
                          onChange={(e) => handleEditChange(r.id, "Mapato_mengineyo", e.target.value)}
                          className="w-28 text-right border rounded px-2 py-1"
                        />
                      </td>

                      <td className="p-2 border text-right">
                        <input
                          type="number"
                          value={edit.Mkopo_toka_nje}
                          onChange={(e) => handleEditChange(r.id, "Mkopo_toka_nje", e.target.value)}
                          className="w-28 text-right border rounded px-2 py-1"
                        />
                      </td>

                      <td className="p-2 border text-right font-semibold text-blue-700">{Number(jumla_mapato).toLocaleString()}</td>

                      <td className="p-2 border text-right">{Number(r.Hisa_zilizokatwa || 0).toLocaleString()}</td>
                      <td className="p-2 border text-right">{Number(r.Matumizi || 0).toLocaleString()}</td>
                      <td className="p-2 border text-right font-semibold text-green-700">{Number(salio).toLocaleString()}</td>

                      <td className="p-2 border text-center">
                        <button
                          onClick={() => handleSave(r)}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          disabled={savingId === r.id}
                        >
                          {savingId === r.id ? "Saving..." : "Save"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
