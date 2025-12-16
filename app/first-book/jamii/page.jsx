"use client";

import { useEffect, useState } from "react";
import { useJamii } from "../../hooks/useJamii";
import { useMembers } from "../../hooks/useMembers";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function JamiiPage() {
  const { jamiiList, loading, fetchJamii, addJamii } = useJamii();
  const { members, fetchMembers } = useMembers();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" or "week"
  const [selectedWeek, setSelectedWeek] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    member_id: "",
    afya: "",
    jamii: "",
    uendeshaji: "",
    week_number: "",
  });

  useEffect(() => {
    fetchJamii();
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.member_id || !form.afya || !form.jamii || !form.uendeshaji || !form.week_number) {
      alert("Tafadhali jaza taarifa zote muhimu.");
      return;
    }

    try {
      await addJamii(form);
      setForm({
        member_id: "",
        afya: "",
        jamii: "",
        uendeshaji: "",
        week_number: "",
      });
      fetchJamii();
      setShowForm(false);
    } catch (error) {
      alert("Imeshindwa kuongeza rekodi. Tafadhali jaribu tena.");
    }
  };

  // Filter jamii records
  let filteredJamii = jamiiList || [];

  // Filter by week if selected
  if (filterType === "week" && selectedWeek) {
    filteredJamii = filteredJamii.filter(
      (j) => j.week_number?.toString() === selectedWeek
    );
  }

  // Filter by search query
  if (searchQuery) {
    filteredJamii = filteredJamii.filter((j) => {
      const memberName = j.member_name?.toLowerCase() || "";
      const searchLower = searchQuery.toLowerCase();
      return memberName.includes(searchLower);
    });
  }

  // Get unique week numbers for filter
  const weekNumbers = Array.from(
    new Set((jamiiList || []).map((j) => j.week_number).filter(Boolean))
  ).sort((a, b) => a - b);

  // Format member number with leading zeros
  const formatMemberNumber = (num) => {
    if (!num) return "-";
    return String(num).padStart(3, "0");
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  // Navigation tabs
  const tabs = [
    { id: "hisa", label: "Hisa", path: "/first-book/hisa" },
    { id: "jamii", label: "Jamii", path: "/first-book/jamii" },
    { id: "adhabu", label: "Adhabu", path: "#" },
    { id: "ada", label: "Ada za wanachama", path: "#" },
    { id: "mapato", label: "Mapato Mengineyo", path: "#" },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Jamii</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.path !== "#") {
                  router.push(tab.path);
                }
              }}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                pathname === tab.path
                  ? "bg-gradient-to-r from-[#347CFF] to-[#2d6ce8] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter and Search Section */}
        <div className="flex items-center gap-4">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFilterType("all");
                setSelectedWeek("");
              }}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                filterType === "all"
                  ? "bg-[#347CFF] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("week")}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                filterType === "week"
                  ? "bg-[#347CFF] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Week
            </button>
          </div>

          {/* Week Selector (shown when Week filter is active) */}
          {filterType === "week" && (
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent text-sm"
            >
              <option value="">Chagua Wiki</option>
              {weekNumbers.map((week) => (
                <option key={week} value={week}>
                  Wiki {week}
                </option>
              ))}
            </select>
          )}

          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tafuta mwanachama"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Add Jamii Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2.5 bg-[#347CFF] text-white font-semibold rounded-lg hover:bg-[#2d6ce8] transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            Ongeza Jamii
          </button>
        </div>
      </div>

      {/* Add Jamii Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Ongeza Rekodi ya Jamii
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chagua Mwanachama *
                  </label>
                  <select
                    value={form.member_id}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, member_id: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                    required
                  >
                    <option value="">Tafuta Mwanachama</option>
                    {members.map((m) => (
                      <option key={m.id || m.namba} value={m.id || m.namba}>
                        {m.namba} - {m.fname} {m.lname}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Afya (TZS) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.afya}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, afya: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jamii (TZS) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.jamii}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, jamii: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Uendeshaji (TZS) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.uendeshaji}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, uendeshaji: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Namba ya Wiki *
                  </label>
                  <input
                    type="number"
                    value={form.week_number}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, week_number: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                    placeholder="1"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#347CFF] text-white font-semibold rounded-lg hover:bg-[#2d6ce8] transition-colors duration-200"
                >
                  Hifadhi Rekodi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm({
                      member_id: "",
                      afya: "",
                      jamii: "",
                      uendeshaji: "",
                      week_number: "",
                    });
                  }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Ghairi
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Jamii Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#347CFF]"></div>
            <p className="mt-4 text-gray-500">Inapakia rekodi za jamii...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Jina la mwanachama
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Afya
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Jamii
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Uendeshaji
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Wiki
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tarehe
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Hali
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJamii.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        {searchQuery || (filterType === "week" && selectedWeek)
                          ? "Hakuna rekodi zilizopatikana kwa utafutaji huu"
                          : "Hakuna rekodi za jamii zilizorekodiwa"}
                      </td>
                    </tr>
                  ) : (
                    filteredJamii.map((jamii, index) => (
                      <tr
                        key={jamii.id || index}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatMemberNumber(jamii.member_number || jamii.member?.namba)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {jamii.member_name ||
                            `${jamii.member?.fname || ""} ${jamii.member?.lname || ""}`.trim() ||
                            "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {jamii.afya ? parseFloat(jamii.afya).toLocaleString() : "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {jamii.jamii ? parseFloat(jamii.jamii).toLocaleString() : "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {jamii.uendeshaji ? parseFloat(jamii.uendeshaji).toLocaleString() : "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {jamii.week_number ? `Wiki ${jamii.week_number}` : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(jamii.tarehe)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="px-4 py-1.5 bg-[#347CFF] text-white font-medium rounded-lg hover:bg-[#2d6ce8] transition-colors duration-200">
                            Tazama
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Count */}
            {filteredJamii.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Jumla: <span className="font-semibold">{filteredJamii.length}</span>{" "}
                  {filteredJamii.length === 1 ? "rekodi" : "rekodi"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
