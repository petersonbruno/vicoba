"use client";

import { useEffect, useState } from "react";
import { useMembers } from "../hooks/useMembers";
import { useAttendances } from "../hooks/useAttendances";

// Independent Member Attendance Component
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

export default function AttendancePage() {
  const { members, fetchMembers } = useMembers();
  const { addAttendance } = useAttendances();

  const [date, setDate] = useState("");
  const [memberStatuses, setMemberStatuses] = useState({});

  useEffect(() => {
    fetchMembers();
  }, []);

  // Initialize member statuses when members are loaded
  useEffect(() => {
    if (members.length > 0) {
      const initialStatuses = {};
      members.forEach(member => {
        initialStatuses[member.namba] = "";
      });
      setMemberStatuses(initialStatuses);
    }
  }, [members]);

  const handleStatusChange = (memberNamba, status) => {
    setMemberStatuses(prev => ({
      ...prev,
      [memberNamba]: status
    }));
  };

  const handleSubmit = async (e) => {
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

  const selectedCount = Object.values(memberStatuses).filter(status => status && status !== "").length;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Mahudhurio ya Wanachama
      </h1>

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

      <form onSubmit={handleSubmit}>
        <div className="border border-gray-200 rounded-xl">
          {members.map((member) => (
            <MemberAttendance
              key={member.namba}
              member={member}
              selectedStatus={memberStatuses[member.namba] || ""}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            {selectedCount} / {members.length} wanachama wamechaguliwa
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Hifadhi Mahudhurio
          </button>
        </div>
      </form>

      {/* Debug info */}
      {/* <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
        <strong>Debug Info:</strong>
        <div>Total Members: {members.length}</div>
        <div>Selected Count: {selectedCount}</div>
        <div>API URL: http://127.0.0.1:8000/api/members/attendances/</div>
        <div>Member Statuses: {JSON.stringify(memberStatuses)}</div>
      </div> */}
    </div>
  );
}