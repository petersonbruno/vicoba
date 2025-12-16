"use client";

import { useEffect, useState } from "react";
import { useMembers } from "../hooks/useMembers";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function WanachamaPage() {
  const { members, loading, fetchMembers, addMember } = useMembers();
  const pathname = usePathname();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    namba: "",
    fname: "",
    lname: "",
    jinsia: "Me",
    hisa_anzia: "",
    jamii_anzia: "",
    tarehe_uanachama: "",
    simu: "",
    cheo: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.namba || !form.fname || !form.lname) {
      alert("Tafadhali jaza taarifa zote muhimu.");
      return;
    }

    await addMember(form);
    setForm({
      namba: "",
      fname: "",
      lname: "",
      jinsia: "Me",
      hisa_anzia: "",
      jamii_anzia: "",
      tarehe_uanachama: "",
      simu: "",
      cheo: "",
    });
    fetchMembers();
    setShowForm(false);
  };

  // Filter members based on search query
  const filteredMembers = (members || []).filter((member) => {
    const fullName = `${member.fname} ${member.lname}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      member.namba?.toString().includes(searchLower) ||
      member.simu?.includes(searchLower)
    );
  });

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

  // Format member number with leading zeros
  const formatMemberNumber = (num) => {
    if (!num) return "-";
    return String(num).padStart(3, "0");
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        {/* Title and Tabs */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Wanachama</h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => router.push("/wanachama")}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              pathname === "/wanachama"
                ? "bg-[#347CFF] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Wanachama
          </button>
          <button
            onClick={() => router.push("/attendance")}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              pathname === "/attendance"
                ? "bg-[#347CFF] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Mahudhurio
          </button>
        </div>

        {/* Search and Add Button */}
        <div className="flex items-center gap-4">
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
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Add Member Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-[#347CFF] text-white font-semibold rounded-lg hover:bg-[#2d6ce8] transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            Ongeza mwanachama
          </button>
        </div>
      </div>

      {/* Add Member Form Modal */}
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
                Ongeza Mwanachama Mpya
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Namba ya Mwanachama *
                  </label>
                  <input
                    type="text"
                    value={form.namba}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, namba: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jina la Kwanza *
                  </label>
                  <input
                    type="text"
                    value={form.fname}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, fname: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jina la Mwisho *
                  </label>
                  <input
                    type="text"
                    value={form.lname}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, lname: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tarehe ya Uwanachama
                  </label>
                  <input
                    type="date"
                    value={form.tarehe_uanachama}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        tarehe_uanachama: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Namba ya Simu
                  </label>
                  <input
                    type="tel"
                    value={form.simu}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, simu: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                    placeholder="0768764572"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cheo
                  </label>
                  <select
                    value={form.cheo}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, cheo: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                  >
                    <option value="">Chagua Cheo</option>
                    <option value="M/Kiti">M/Kiti</option>
                    <option value="Katibu">Katibu</option>
                    <option value="Mhasibu">Mhasibu</option>
                    <option value="Nidhamu">Nidhamu</option>
                    <option value="Mjumbe">Mjumbe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jinsia
                  </label>
                  <select
                    value={form.jinsia}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, jinsia: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                  >
                    <option value="Me">Me</option>
                    <option value="Ke">Ke</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hisa Anzia
                  </label>
                  <input
                    type="number"
                    value={form.hisa_anzia}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        hisa_anzia: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jamii Anzia
                  </label>
                  <input
                    type="number"
                    value={form.jamii_anzia}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        jamii_anzia: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#347CFF] text-white font-semibold rounded-lg hover:bg-[#2d6ce8] transition-colors duration-200"
                >
                  Hifadhi Mwanachama
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm({
                      namba: "",
                      fname: "",
                      lname: "",
                      jinsia: "Me",
                      hisa_anzia: "",
                      jamii_anzia: "",
                      tarehe_uanachama: "",
                      simu: "",
                      cheo: "",
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

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#347CFF]"></div>
            <p className="mt-4 text-gray-500">Inapakia wanachama...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      NO.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      JINA
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      TAREHE YA UWANACHAMA
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      SIMU
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      CHEO
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        {searchQuery
                          ? "Hakuna mwanachama aliyepatikana kwa utafutaji huu"
                          : "Hakuna wanachama waliorekodiwa"}
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member, index) => (
                      <tr
                        key={member.namba || index}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatMemberNumber(member.namba)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.fname} {member.lname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(member.tarehe_uanachama)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {member.simu || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {member.cheo || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Count */}
            {filteredMembers.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Jumla: <span className="font-semibold">{filteredMembers.length}</span>{" "}
                  {filteredMembers.length === 1 ? "mwanachama" : "wanachama"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

