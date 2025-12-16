"use client";
import { useEffect, useState } from "react";
import { useMembers } from "../../hooks/useMembers";
import { useLoans } from "../../hooks/useLoans";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function BusinessLoanPage() {
  const { members, loading: loadingMembers, fetchMembers } = useMembers();
  const { loans, loading: loadingLoans, fetchLoans, addLoan } = useLoans();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    member_id: "",
    tarehe: "",
    amount: "",
    nyongeza: "",
    bima: "",
    tarehe_kulejesha: "",
    aina_biashara: "",
  });

  useEffect(() => {
    fetchMembers();
    fetchLoans();
  }, []);

  const totalLoan =
    Number(form.amount || 0) + Number(form.nyongeza || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.member_id || !form.amount) {
      alert("Tafadhali chagua mwanachama na weka kiasi cha mkopo!");
      return;
    }

    try {
      await addLoan({
        member_id: form.member_id,
        tarehe: form.tarehe,
        amount: form.amount,
        nyongeza: form.nyongeza,
        bima: form.bima,
        tarehe_kulejesha: form.tarehe_kulejesha,
        aina_biashara: form.aina_biashara,
      });

      setForm({
        member_id: "",
        tarehe: "",
        amount: "",
        nyongeza: "",
        bima: "",
        tarehe_kulejesha: "",
        aina_biashara: "",
      });

      fetchLoans();
      setShowForm(false);
    } catch (error) {
      alert("Imeshindwa kuongeza mkopo. Tafadhali jaribu tena.");
    }
  };

  // Filter loans based on search query
  const filteredLoans = (loans || []).filter((loan) => {
    const memberName = loan.member_name?.toLowerCase() || "";
    const searchLower = searchQuery.toLowerCase();
    return (
      memberName.includes(searchLower) ||
      loan.member_number?.toString().includes(searchLower) ||
      loan.loan_number?.toString().includes(searchLower)
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

  // Format loan number with leading zeros
  const formatLoanNumber = (num) => {
    if (!num) return "-";
    return String(num).padStart(3, "0");
  };

  // Determine loan status (you may need to adjust this based on your data structure)
  const getLoanStatus = (loan) => {
    // This is a placeholder - adjust based on your actual data structure
    if (loan.status) return loan.status;
    if (loan.tarehe_kulejesha && new Date(loan.tarehe_kulejesha) < new Date()) {
      return "Imelipwa";
    }
    return "Bado";
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        {/* Title and Navigation Tabs */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Mikopo Wa biashara</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => router.push("/second-book/biashara")}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              pathname === "/second-book/biashara"
                ? "bg-gradient-to-r from-[#347CFF] to-[#2d6ce8] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Mikopo Wa biashara
          </button>
          <button
            onClick={() => router.push("/second-book/jamii")}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              pathname === "/second-book/jamii"
                ? "bg-gradient-to-r from-[#347CFF] to-[#2d6ce8] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Mikopo wa Jamii
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
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Add Loan Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2.5 bg-[#347CFF] text-white font-semibold rounded-lg hover:bg-[#2d6ce8] transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            Ongeza mkopo
          </button>
        </div>
      </div>

      {/* Add Loan Form Modal */}
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
                Ongeza Mkopo Mpya
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

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    Tarehe ya kuchukua mkopo
                  </label>
                  <input
                    type="date"
                    value={form.tarehe}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, tarehe: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kiasi cha Mkopo (TZS) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, amount: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nyongeza ya Mkopo (TZS)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.nyongeza}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, nyongeza: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bima
                  </label>
                  <input
                    type="text"
                    value={form.bima}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, bima: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tarehe ya Kulejesha
                  </label>
                  <input
                    type="date"
                    value={form.tarehe_kulejesha}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        tarehe_kulejesha: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Aina ya Biashara
                  </label>
                  <input
                    type="text"
                    value={form.aina_biashara}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        aina_biashara: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347CFF] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-700">
                    <strong>Jumla ya Mkopo:</strong>{" "}
                    <span className="text-[#347CFF] font-bold">
                      {totalLoan.toLocaleString()} TZS
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#347CFF] text-white font-semibold rounded-lg hover:bg-[#2d6ce8] transition-colors duration-200"
                >
                  Hifadhi Mkopo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm({
                      member_id: "",
                      tarehe: "",
                      amount: "",
                      nyongeza: "",
                      bima: "",
                      tarehe_kulejesha: "",
                      aina_biashara: "",
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

      {/* Loans Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {loadingLoans ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#347CFF]"></div>
            <p className="mt-4 text-gray-500">Inapakia mikopo...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      NAMBA YA MKOPO
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      JINA LA MKOPA
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      JINSIA
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      TAREHE YA KUCHUA MKOPO
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      HALI
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLoans.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        {searchQuery
                          ? "Hakuna mkopo uliopatikana kwa utafutaji huu"
                          : "Hakuna mikopo iliyorekodiwa"}
                      </td>
                    </tr>
                  ) : (
                    filteredLoans.map((loan, index) => {
                      const status = getLoanStatus(loan);
                      return (
                        <tr
                          key={loan.id || index}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatLoanNumber(loan.loan_number || loan.id || index + 1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {loan.member_name ||
                              `${loan.member?.fname || ""} ${loan.member?.lname || ""}`.trim() ||
                              "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {loan.member_gender || loan.member?.jinsia || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(loan.tarehe)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              className={`px-4 py-1.5 font-medium rounded-lg transition-colors duration-200 ${
                                status === "Imelipwa"
                                  ? "bg-[#347CFF] text-white hover:bg-[#2d6ce8]"
                                  : "bg-red-500 text-white hover:bg-red-600"
                              }`}
                            >
                              {status}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Count */}
            {filteredLoans.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Jumla: <span className="font-semibold">{filteredLoans.length}</span>{" "}
                  {filteredLoans.length === 1 ? "mkopo" : "mikopo"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
