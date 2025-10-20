"use client";
import { useEffect, useState } from "react";
import FormInput from "./../../components/FormInput";
import DataTable from "./../../components/DataTable";
import { useMembers } from "../../hooks/useMembers";
import { useHisa } from "../../hooks/useHisa";

export default function HisaPage() {
  const { members, loading: loadingMembers, fetchMembers } = useMembers();
  const { hisaList, loading: loadingHisa, fetchHisa, addHisa } = useHisa();

  const [form, setForm] = useState({
    member_id: "",
    kiasi: "",
    week_number: "",
  });
  const [selectedWeek, setSelectedWeek] = useState(""); // 🟢 for filtering
  const [uniqueWeeks, setUniqueWeeks] = useState([]); // 🟢 store unique week numbers

  // Load members + hisa records
  useEffect(() => {
    fetchMembers();
    fetchHisa();
  }, []);

  // Extract unique week numbers from hisaList
  useEffect(() => {
    const weeks = [
      ...new Set(
        hisaList
          .map((h) => h.week_number)
          .filter((w) => w !== null && w !== undefined && w !== "")
      ),
    ];
    setUniqueWeeks(weeks.sort((a, b) => a - b));
  }, [hisaList]);

  async function handleAdd(e) {
    e.preventDefault();

    if (!form.member_id || !form.kiasi || !form.week_number) {
      alert("Tafadhali jaza taarifa zote muhimu!");
      return;
    }

    try {
      await addHisa({
        member_id: form.member_id,
        kiasi: form.kiasi,
        week_number: form.week_number,
      });

      setForm({ member_id: "", kiasi: "", week_number: "" });
      fetchHisa();
    } catch (error) {
      console.error(
        "Failed to add Hisa:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.error ||
          "Imeshindikana kuongeza hisa. Hakikisha taarifa ni sahihi."
      );
    }
  }

  // 🔹 Filter Hisa records by selected week number
  const filteredHisa = selectedWeek
    ? hisaList.filter((h) => String(h.week_number) === String(selectedWeek))
    : hisaList;

  const formatted = (filteredHisa || []).map((h) => ({
    Member: h.member_name || "-",
    Hisa: h.kiasi,
    Week: h.week_number || "-",
    Date: new Date(h.tarehe).toLocaleString(),
  }));

  return (
    <section className="max-w-5xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Hisa za Wanachama
      </h1>

      {/* --- Add Hisa Form --- */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Member dropdown */}
        <div>
          <label
            htmlFor="member"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Chagua Mwanachama
          </label>
          <select
            id="member"
            value={form.member_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, member_id: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">
              {loadingMembers ? "Inapakia..." : "Tafuta Mwanachama"}
            </option>
            {members.map((m) => (
              <option key={`${m.id}-${m.namba}`} value={m.id}>
                {m.namba} - {m.fname} {m.lname}
              </option>
            ))}
          </select>
        </div>

        {/* Hisa input */}
        <FormInput
          id="kiasi"
          label="Kiasi cha Hisa (TZS)"
          type="number"
          value={form.kiasi}
          onChange={(e) => setForm((f) => ({ ...f, kiasi: e.target.value }))}
        />

        {/* Week number input */}
        <FormInput
          id="week_number"
          label="Namba ya Wiki"
          type="number"
          value={form.week_number}
          onChange={(e) =>
            setForm((f) => ({ ...f, week_number: e.target.value }))
          }
        />

        {/* Submit button */}
        <div className="md:col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
          >
            Ongeza Rekodi
          </button>
        </div>
      </form>

      {/* --- Hisa Table --- */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Rekodi za Hisa
          </h2>

          {/* 🔹 Week Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Chuja kwa Wiki:</label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Zote</option>
              {uniqueWeeks.map((w) => (
                <option key={w} value={w}>
                  Wiki {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loadingHisa ? (
          <p>Inapakia rekodi za hisa...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-auto">
            <DataTable
              columns={["Member", "Hisa", "Week", "Date"]}
              rows={formatted}
            />
          </div>
        )}
      </div>
    </section>
  );
}
