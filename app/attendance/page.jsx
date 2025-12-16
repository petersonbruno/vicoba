"use client";

import { useEffect, useState } from "react";
import { useMembers } from "../hooks/useMembers";
import { useAttendances } from "../hooks/useAttendances";
import { useWeeks } from "../hooks/useWeeks";

// Independent Member Attendance Component (from your code)
function MemberAttendance({ member, onStatusChange, selectedStatus }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "yupo":
        return "bg-green-100 text-green-800 border-green-400";
      case "hayupo":
        return "bg-red-100 text-red-800 border-red-400";
      case "ruhusa":
        return "bg-blue-100 text-blue-800 border-blue-400";
      default:
        return "bg-white text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <p className="font-medium text-gray-800">
          {member.fname} {member.lname}
        </p>
        <p className="text-sm text-gray-500">
          Namba: {member.namba} | Jinsia: {member.jinsia}
        </p>
      </div>

      <div className="mt-3 sm:mt-0">
        <select
          value={selectedStatus || ""}
          onChange={(e) => onStatusChange(member.namba, e.target.value)}
          className={`border rounded-lg px-3 py-2 w-40 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${getStatusColor(
            selectedStatus
          )}`}
        >
          <option value="">-- Chagua Hali --</option>
          <option value="yupo">✅ Yupo</option>
          <option value="hayupo">❌ Hayupo</option>
          <option value="ruhusa">🕊️ Ruhusa</option>
        </select>
      </div>
    </div>
  );
}

export default function ReportsManager() {
  const { members, fetchMembers } = useMembers();
  const { addAttendance } = useAttendances();
  const { addWeek, weeks, fetchWeeks } = useWeeks();

  const [activeSection, setActiveSection] = useState(null);
  const [weekNumber, setWeekNumber] = useState("");
  const [date, setDate] = useState("");
  const [memberStatuses, setMemberStatuses] = useState({});
  const [weekLoading, setWeekLoading] = useState(false);
  const [selectedWeekFilter, setSelectedWeekFilter] = useState("");

  // Sample mahudhurio data based on your structure
  const [mahudhurioData, setMahudhurioData] = useState([]);

  useEffect(() => {
    fetchMembers();
    fetchWeeks();
  }, []);

  // Initialize member statuses when members are loaded
  useEffect(() => {
    if (members.length > 0) {
      const initialStatuses = {};
      members.forEach(member => {
        initialStatuses[member.namba] = "";
      });
      setMemberStatuses(initialStatuses);
      
      // Generate sample mahudhurio data from members with different weeks
      const sampleData = members.map((member, index) => ({
        id: index + 1,
        memberName: `${member.fname} ${member.lname}`,
        amount: (10000 + (index * 1000)).toFixed(2),
        week: (index % 3) + 1, // Distribute across weeks 1, 2, 3
        namba: member.namba,
        jinsia: member.jinsia,
        status: ["yupo", "hayupo", "ruhusa"][index % 3],
        tarehe: new Date(Date.now() - (index * 86400000)).toISOString().split('T')[0]
      }));
      setMahudhurioData(sampleData);
    }
  }, [members]);

  // Filter mahudhurio data by selected week
  const filteredMahudhurioData = selectedWeekFilter 
    ? mahudhurioData.filter(item => item.week.toString() === selectedWeekFilter)
    : mahudhurioData;

  // Get unique weeks from mahudhurio data for filter dropdown
  const availableWeeks = [...new Set(mahudhurioData.map(item => item.week.toString()))].sort((a, b) => parseInt(a) - parseInt(b));

  const handleStatusChange = (memberNamba, status) => {
    setMemberStatuses(prev => ({
      ...prev,
      [memberNamba]: status
    }));
  };

  const handleWeekSubmit = async (e) => {
    e.preventDefault();
    if (!weekNumber) {
      alert("Tafadhali weka namba ya wiki.");
      return;
    }

    setWeekLoading(true);
    try {
      const weekData = {
        week_number: parseInt(weekNumber)
      };

      console.log("📤 Submitting week to API:", weekData);
      
      const response = await addWeek(weekData);
      
      alert(`✅ Wiki ${weekNumber} imeongezwa kikamilifu!`);
      console.log("✅ Week added successfully:", response);
      
      setWeekNumber("");
      setActiveSection(null);
      fetchWeeks(); // Refresh weeks list
    } catch (error) {
      console.error("❌ Failed to save week:", error);
      
      let errorMessage = "❌ Hitilafu katika kuongeza wiki.";
      
      if (error.response?.status === 400) {
        if (error.response.data?.week_number) {
          errorMessage += `\n\nHitilafu: ${error.response.data.week_number.join(', ')}`;
        } else {
          errorMessage += `\n\nHitilafu: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.response?.status === 404) {
        errorMessage += `\n\nAPI haipatikani. Hakikisha:\n1. Django server inaendeshwa\n2. API endpoint /api/members/weeks/add/ ipo`;
      } else if (error.response?.status === 500) {
        errorMessage += `\n\nHitilafu ya server. Angalia console ya Django.`;
      }
      
      alert(errorMessage);
    } finally {
      setWeekLoading(false);
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      alert("Tafadhali chagua tarehe ya mahudhurio.");
      return;
    }

    // Create payload that matches backend expectations
    const payload = Object.entries(memberStatuses)
      .filter(([memberNamba, status]) => status && status !== "")
      .map(([memberNamba, status]) => {
        const member = members.find(m => m.namba === memberNamba);
        return {
          member: parseInt(memberNamba),
          jinsia: member.jinsia,
          tarehe: date,
          status: status
        };
      });

    if (payload.length === 0) {
      alert("Tafadhali chagua angalau mahudhurio moja.");
      return;
    }

    try {
      console.log("Submitting to Django:", payload);
      
      // Submit each attendance record
      await Promise.all(payload.map((record) => addAttendance(record)));
      
      alert("✅ Mahudhurio yamehifadhiwa kikamilifu!");
      
      // Reset all statuses to empty
      const resetStatuses = {};
      members.forEach(member => {
        resetStatuses[member.namba] = "";
      });
      setMemberStatuses(resetStatuses);
      setDate("");
      setActiveSection(null);
    } catch (error) {
      console.error("Failed to save attendance:", error);
      
      let errorMessage = "❌ Hitilafu katika kuhifadhi mahudhurio.";
      
      if (error.response?.status === 404) {
        errorMessage += `\n\nAPI haipatikani. Hakikisha:\n1. Django server inaendeshwa kwenye http://127.0.0.1:8000\n2. API endpoint /api/members/attendances/ ipo\n3. Check Django console for errors`;
      } else if (error.response?.status === 400) {
        errorMessage += `\n\nData hitilafu: ${JSON.stringify(error.response.data)}`;
      }
      
      alert(errorMessage);
    }
  };

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const selectedCount = Object.values(memberStatuses).filter(status => status && status !== "").length;

  const getStatusDisplay = (status) => {
    switch (status) {
      case "yupo": return "✅ Yupo";
      case "hayupo": return "❌ Hayupo";
      case "ruhusa": return "🕊️ Ruhusa";
      default: return "Haijachaguliwa";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Huduma za Mahudhurio
      </h1>

      {/* Weeks Summary */}
      {weeks.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-800">Zilizowekwa:</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-700">Wiki zilizopo: {weeks.length}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {weeks.map(week => (
              <span key={week.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Wiki {week.week_number}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Buttons Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
        {/* Week Number Button */}
        <button
          onClick={() => toggleSection('week')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeSection === 'week' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📅 Weka Namba ya Wiki
        </button>

        {/* Mahudhurio Button */}
        <button
          onClick={() => toggleSection('mahudhurio')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeSection === 'mahudhurio' 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          👥 Mahudhurio ya Wanachama
        </button>
      </div>

      {/* Week Number Form */}
      {activeSection === 'week' && (
        <div className="mb-6 p-6 border-2 border-blue-200 rounded-lg bg-blue-50 animate-fadeIn">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Weka Namba ya Wiki
          </h2>
          <form onSubmit={handleWeekSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Namba ya Wiki
              </label>
              <input
                type="number"
                value={weekNumber}
                onChange={(e) => setWeekNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Weka namba ya wiki..."
                min="1"
                required
                disabled={weekLoading}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={weekLoading}
                className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                  weekLoading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {weekLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Inatumwa...
                  </>
                ) : (
                  'Wasilisha'
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveSection(null)}
                disabled={weekLoading}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Ghairi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mahudhurio Section */}
      {activeSection === 'mahudhurio' && (
        <div className="mb-6 p-6 border-2 border-green-200 rounded-lg bg-green-50 animate-fadeIn">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            Mahudhurio ya Wanachama
          </h2>

          {/* Date Picker */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-1 font-medium">
              Tarehe ya Mahudhurio
            </label>
            <input
              type="date"
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Attendance Form */}
          <form onSubmit={handleAttendanceSubmit}>
            <div className="border border-gray-200 rounded-xl mb-6">
              {members.map((member) => (
                <MemberAttendance
                  key={member.namba}
                  member={member}
                  selectedStatus={memberStatuses[member.namba] || ""}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                {selectedCount} / {members.length} wanachama wamechaguliwa
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Hifadhi Mahudhurio
              </button>
            </div>
          </form>

          {/* Mahudhurio Table */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Rekodi za Mahudhurio
              </h3>
              
              {/* Week Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Chagua Wiki:</label>
                <select
                  value={selectedWeekFilter}
                  onChange={(e) => setSelectedWeekFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Zote</option>
                  {availableWeeks.map(week => (
                    <option key={week} value={week}>
                      Wiki {week}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Jumla ya Wanachama</p>
                <p className="text-2xl font-bold text-gray-800">{filteredMahudhurioData.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Waliopo</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredMahudhurioData.filter(item => item.status === 'yupo').length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Wasipo</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredMahudhurioData.filter(item => item.status === 'hayupo').length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600">Ruhusa</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredMahudhurioData.filter(item => item.status === 'ruhusa').length}
                </p>
              </div>
            </div>

            {/* Filter Info */}
            {selectedWeekFilter && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  📊 Inaonyesha data za <strong>Wiki {selectedWeekFilter}</strong> pekee. 
                  <button 
                    onClick={() => setSelectedWeekFilter("")}
                    className="ml-2 text-yellow-900 underline hover:text-yellow-700"
                  >
                    Onyesha zote
                  </button>
                </p>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full table-auto">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Jina la Mwanachama
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Namba
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Jinsia
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Wiki
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Hali
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMahudhurioData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.memberName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.namba}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.jinsia}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Wiki {item.week}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'yupo' ? 'bg-green-100 text-green-800' :
                          item.status === 'hayupo' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {getStatusDisplay(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* No Data Message */}
            {filteredMahudhurioData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {selectedWeekFilter 
                  ? `Hakuna data ya mahudhurio kwa Wiki ${selectedWeekFilter}`
                  : "Hakuna data ya mahudhurio iliyopatikana"
                }
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setActiveSection(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Funga
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!activeSection && (
        <div className="text-center text-gray-500 py-8">
          <p>Bonyeza kitufe hapo juu kuanza kusimamia huduma</p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-8">
            <div className="text-sm">
              <span className="font-semibold">📅 Weka Namba ya Wiki:</span>
              <br />Weka namba ya wiki kwa ajili ya ripoti
            </div>
            <div className="text-sm">
              <span className="font-semibold">👥 Mahudhurio:</span>
              <br />Andaa na angalia mahudhurio ya wanachama
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}