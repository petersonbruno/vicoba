"use client";

import { useState, useEffect } from "react";
import { useHisa } from "../hooks/useHisa";
import { useJamii } from "../hooks/useJamii";
import { useLoans } from "../hooks/useLoans";
import { useCommunityLoans } from "../hooks/useCommunityLoans";
import { useMembers } from "../hooks/useMembers";
import { useAttendances } from "../hooks/useAttendances";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("mwezi"); // "mwezi" or "mali"
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data for reports
  const { hisaList, fetchHisa } = useHisa();
  const { jamiiList, fetchJamii } = useJamii();
  const { loans, fetchLoans } = useLoans();
  const { loans: communityLoans, fetchLoans: fetchCommunityLoans } = useCommunityLoans();
  const { members, fetchMembers } = useMembers();
  const { attendances, fetchAttendances } = useAttendances();

  useEffect(() => {
    fetchHisa();
    fetchJamii();
    fetchLoans();
    fetchCommunityLoans();
    fetchMembers();
    fetchAttendances();
  }, []);

  // Format number with commas
  const formatNumber = (num) => {
    if (!num && num !== 0) return "-";
    return Number(num).toLocaleString();
  };

  // Calculate monthly report data (sample data structure)
  const calculateMonthlyReport = () => {
    // Group data by week (sample implementation)
    const weeks = [1, 2, 3, 4, 5];
    const weeklyData = weeks.map((week) => {
      // Calculate totals for each week
      const weekHisa = (hisaList || []).filter((h) => h.week_number === week);
      const weekJamii = (jamiiList || []).filter((j) => j.week_number === week);
      const weekAttendance = (attendances || []).filter((a) => a.week_number === week || a.week === week);

      const hisaTotal = weekHisa.reduce((sum, h) => sum + (Number(h.kiasi) || 0), 0);
      const jamiiTotal = weekJamii.reduce((sum, j) => sum + (Number(j.jamii) || 0), 0);
      const afyaTotal = weekJamii.reduce((sum, j) => sum + (Number(j.afya) || 0), 0);
      const uendeshajiTotal = weekJamii.reduce((sum, j) => sum + (Number(j.uendeshaji) || 0), 0);

      return {
        week: `JUMALA ${week}`,
        mahudhurio: weekAttendance.length || 30,
        hisa: hisaTotal || 520000,
        elimu_mafunzo: 50000,
        afya: afyaTotal || 50000,
        uendeshaji: uendeshajiTotal || 50000,
        adhabu: 3000,
        bima: 20000,
        nyongeza: 10000,
        mkopo_toka_nje: 0,
        jumla_mapato_wiki: hisaTotal + jamiiTotal + afyaTotal + uendeshajiTotal + 50000 + 3000 + 20000 + 10000 || 703000,
        jumla_kuu_mapato: 15000,
        hisa_zilizokatwa: 15000,
        matumizi: 10000,
        salio: 678000,
      };
    });

    // Calculate totals
    const totals = {
      week: "JUMLA",
      mahudhurio: weeklyData.reduce((sum, w) => sum + w.mahudhurio, 0),
      hisa: weeklyData.reduce((sum, w) => sum + w.hisa, 0),
      elimu_mafunzo: weeklyData.reduce((sum, w) => sum + w.elimu_mafunzo, 0),
      afya: weeklyData.reduce((sum, w) => sum + w.afya, 0),
      uendeshaji: weeklyData.reduce((sum, w) => sum + w.uendeshaji, 0),
      adhabu: weeklyData.reduce((sum, w) => sum + w.adhabu, 0),
      bima: weeklyData.reduce((sum, w) => sum + w.bima, 0),
      nyongeza: weeklyData.reduce((sum, w) => sum + w.nyongeza, 0),
      mkopo_toka_nje: 0,
      jumla_mapato_wiki: weeklyData.reduce((sum, w) => sum + w.jumla_mapato_wiki, 0),
      jumla_kuu_mapato: weeklyData.reduce((sum, w) => sum + w.jumla_kuu_mapato, 0),
      hisa_zilizokatwa: weeklyData.reduce((sum, w) => sum + w.hisa_zilizokatwa, 0),
      matumizi: weeklyData.reduce((sum, w) => sum + w.matumizi, 0),
      salio: weeklyData.reduce((sum, w) => sum + w.salio, 0),
    };

    return [...weeklyData, totals];
  };

  const monthlyReportData = calculateMonthlyReport();

  // Calculate group assets
  const calculateGroupAssets = () => {
    const totalBusinessLoans = (loans || []).reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
    const totalCommunityLoans = (communityLoans || []).reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
    const paidBusinessLoans = (loans || []).filter((l) => l.status === "Imelipwa" || getLoanStatus(l) === "Imelipwa").reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
    const paidCommunityLoans = (communityLoans || []).filter((l) => l.status === "Imelipwa" || getLoanStatus(l) === "Imelipwa").reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
    const unpaidBusinessLoans = totalBusinessLoans - paidBusinessLoans;
    const unpaidCommunityLoans = totalCommunityLoans - paidCommunityLoans;

    return {
      fedha_taslim: 2000000,
      fedha_bank: 1250000,
      mikopo_jamii: totalCommunityLoans || 500000,
      mikopo_biashara: totalBusinessLoans || 12000000,
      madeni_kikundi: 100000,
      jumla: 2000000 + 1250000 + (totalCommunityLoans || 500000) + (totalBusinessLoans || 12000000) - 100000,
    };
  };

  const groupAssets = calculateGroupAssets();

  // Calculate loan statistics by gender
  const calculateLoanStats = () => {
    const allLoans = [...(loans || []), ...(communityLoans || [])];
    const maleLoans = allLoans.filter((l) => l.member_gender === "Me" || l.member?.jinsia === "Me");
    const femaleLoans = allLoans.filter((l) => l.member_gender === "Ke" || l.member?.jinsia === "Ke");

    const calculateLoanMetrics = (loanList) => {
      const total = loanList.length;
      const issued = loanList.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
      const paid = loanList.filter((l) => l.status === "Imelipwa" || getLoanStatus(l) === "Imelipwa").reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
      const unpaid = issued - paid;
      return { total, issued, paid, unpaid };
    };

    const maleStats = calculateLoanMetrics(maleLoans);
    const femaleStats = calculateLoanMetrics(femaleLoans);

    return {
      male: { ...maleStats, total: maleStats.total || 50, issued: maleStats.issued || 10000000, unpaid: maleStats.unpaid || 5000000, paid: maleStats.paid || 5000000 },
      female: { ...femaleStats, total: femaleStats.total || 50, issued: femaleStats.issued || 10000000, unpaid: femaleStats.unpaid || 5000000, paid: femaleStats.paid || 5000000 },
      total: {
        total: (maleStats.total || 50) + (femaleStats.total || 50),
        issued: (maleStats.issued || 10000000) + (femaleStats.issued || 10000000),
        unpaid: (maleStats.unpaid || 5000000) + (femaleStats.unpaid || 5000000),
        paid: (maleStats.paid || 5000000) + (femaleStats.paid || 5000000),
      },
    };
  };

  const loanStats = calculateLoanStats();

  // Calculate income statement
  const calculateIncomeStatement = () => {
    return {
      riba_mikopo: 500000,
      miradi_kikundi: 500000,
      misaada: 30000,
      ada_wanachama: 50000,
      ada_zingine: 10000,
      jumla: 500000 + 500000 + 30000 + 50000 + 10000,
    };
  };

  const incomeStatement = calculateIncomeStatement();

  // Helper function to determine loan status
  const getLoanStatus = (loan) => {
    if (loan.status) return loan.status;
    if (loan.tarehe_kulejesha && new Date(loan.tarehe_kulejesha) < new Date()) {
      return "Imelipwa";
    }
    return "Bado";
  };

  // Download PDF function (placeholder)
  const handleDownloadPDF = () => {
    alert("PDF download functionality will be implemented here");
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === "mwezi" ? "Reports Ya Mwezi" : "Reports Ya Mali za Kikundi"}
          </h1>
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-2.5 bg-[#347CFF] text-white font-semibold rounded-lg hover:bg-[#2d6ce8] transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Pakua (PDF)
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab("mwezi")}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              activeTab === "mwezi"
                ? "bg-gradient-to-r from-[#347CFF] to-[#2d6ce8] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Reports Ya Mwezi
          </button>
          <button
            onClick={() => setActiveTab("mali")}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              activeTab === "mali"
                ? "bg-gradient-to-r from-[#347CFF] to-[#2d6ce8] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Mali za Kikundi
          </button>
        </div>

        {/* Search Bar */}
        {activeTab === "mwezi" && (
          <div className="flex-1 relative max-w-md">
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
        )}
      </div>

      {/* Monthly Reports Tab */}
      {activeTab === "mwezi" && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    MAPATO YA KILA JUMA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    MAHUDHURIO
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    HISA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ELIMU NA MAFUNZO
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    AFYA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    UENDESHAJI
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ADHABU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    BIMA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    NYONGEZA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    MIKOPO TOKA NJE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    JUMLA YA MAPATO YA WIKI
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    JUMLA KUU YA MAPATO YA WIKI
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    HISA ZILIZOKATWA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    MATUMIZI
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    SALIO
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyReportData.map((row, index) => {
                  const isTotal = row.week === "JUMLA";
                  return (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        isTotal ? "bg-gray-100 font-semibold" : ""
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.week}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.mahudhurio)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.hisa)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.elimu_mafunzo)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.afya)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.uendeshaji)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.adhabu)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.bima)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.nyongeza)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {row.mkopo_toka_nje === 0 ? "-" : formatNumber(row.mkopo_toka_nje)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.jumla_mapato_wiki)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.jumla_kuu_mapato)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.hisa_zilizokatwa)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.matumizi)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatNumber(row.salio)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Group Assets Tab */}
      {activeTab === "mali" && (
        <div className="space-y-6">
          {/* Section 1: MALI ZA KIKUNDI */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">MALI ZA KIKUNDI</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Fedha Taslim</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(groupAssets.fedha_taslim)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fedha zilizopo Bank</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(groupAssets.fedha_bank)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Mikopo ya jamii</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(groupAssets.mikopo_jamii)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Mikopo ya Biashara</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(groupAssets.mikopo_biashara)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Madeni ya Kikundi</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(groupAssets.madeni_kikundi)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Jumla</p>
                <p className="text-lg font-semibold text-[#347CFF]">
                  {formatNumber(groupAssets.jumla)}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: IDADI YA MIKOPO KWA ROBO HII YA MWAKA */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              IDADI YA MIKOPO KWA ROBO HII YA MWAKA
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Jinsia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      IDADI YA MIKOPO
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      THAMANI YA MIKOPO ILIYOTOLEWA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      THAMANI YA MIKOPO HAIJALIPWA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      THAMANI YA MIKOPO ILIYOLIPWA
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ME
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatNumber(loanStats.male.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatNumber(loanStats.male.issued)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatNumber(loanStats.male.unpaid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatNumber(loanStats.male.paid)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      KE
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatNumber(loanStats.female.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatNumber(loanStats.female.issued)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatNumber(loanStats.female.unpaid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatNumber(loanStats.female.paid)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-100 font-semibold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Jumla
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(loanStats.total.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(loanStats.total.issued)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(loanStats.total.unpaid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(loanStats.total.paid)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: TAARIFA YA MAPATO YA KIKUNDI */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              TAARIFA YA MAPATO YA KIKUNDI
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Riba za Mikopo</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(incomeStatement.riba_mikopo)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Miradi ya kikundi</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(incomeStatement.miradi_kikundi)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Misaada</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(incomeStatement.misaada)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Ada za wanachama</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(incomeStatement.ada_wanachama)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Adazingine za wanachama</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(incomeStatement.ada_zingine)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Jumla ya Mapato</p>
                <p className="text-lg font-semibold text-[#347CFF]">
                  {formatNumber(incomeStatement.jumla)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

