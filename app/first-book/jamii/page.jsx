"use client";
import { useEffect, useState } from "react";
import FormInput from "./../../components/FormInput";
import DataTable from "./../../components/DataTable";
import { useMembers } from "../../hooks/useMembers";
import { useJamii } from "../../hooks/useJamii";

export default function JamiiPage() {
  const { members, loading: loadingMembers, fetchMembers } = useMembers();
  const { jamiiList, loading: loadingJamii, fetchJamii, addJamii } = useJamii();

  const [form, setForm] = useState({
    member_id: "",
    afya: "",
    jamii: "",
    uendeshaji: "",
    week_number: "",
  });

  const [weekFilter, setWeekFilter] = useState("");

  useEffect(() => {
    fetchMembers();
    fetchJamii();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();

    const { member_id, afya, jamii, uendeshaji, week_number } = form;
    if (!member_id || !afya || !jamii || !uendeshaji || !week_number) {
      alert("Tafadhali jaza viwanja vyote!");
      return;
    }

    try {
      await addJamii({
        member_id,
        afya,
        jamii,
        uendeshaji,
        week_number,
      });

      setForm({
        member_id: "",
        afya: "",
        jamii: "",
        uendeshaji: "",
        week_number: "",
      });

      fetchJamii();
    } catch (error) {
      console.error(
        "Failed to add Jamii record:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.error ||
          "Imeshindikana kuongeza rekodi. Hakikisha data ni sahihi."
      );
    }
  }

  // 🧮 Unique week numbers for dropdown filter
  const weekNumbers = Array.from(
    new Set((jamiiList || []).map((j) => j.week_number))
  ).sort((a, b) => a - b);

  // 📅 Filter by week if selected
  const filteredJamii =
    weekFilter && weekFilter !== ""
      ? jamiiList.filter((j) => j.week_number === parseInt(weekFilter))
      : jamiiList;

  // 📋 Format table data
  const formatted = (filteredJamii || []).map((j) => ({
    Member: j.member_name || "-",
    Afya: j.afya,
    Jamii: j.jamii,
    Uendeshaji: j.uendeshaji,
    Week: j.week_number,
    Date: new Date(j.tarehe).toLocaleString(),
  }));

  return (
    <section className="max-w-6xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Michango ya Jamii
      </h1>

      {/* --- Add Jamii Form --- */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-4"
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

        {/* Afya, Jamii, Uendeshaji, Week */}
        <FormInput
          id="afya"
          label="Afya (TZS)"
          type="number"
          value={form.afya}
          onChange={(e) => setForm((f) => ({ ...f, afya: e.target.value }))}
        />
        <FormInput
          id="jamii"
          label="Jamii (TZS)"
          type="number"
          value={form.jamii}
          onChange={(e) => setForm((f) => ({ ...f, jamii: e.target.value }))}
        />
        <FormInput
          id="uendeshaji"
          label="Uendeshaji (TZS)"
          type="number"
          value={form.uendeshaji}
          onChange={(e) =>
            setForm((f) => ({ ...f, uendeshaji: e.target.value }))
          }
        />
        <FormInput
          id="week_number"
          label="Namba ya Wiki"
          type="number"
          value={form.week_number}
          onChange={(e) =>
            setForm((f) => ({ ...f, week_number: e.target.value }))
          }
        />

        {/* Submit */}
        <div className="md:col-span-5 flex justify-end mt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
          >
            Ongeza Rekodi
          </button>
        </div>
      </form>

      {/* --- Jamii Table --- */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Rekodi za Michango ya Jamii
          </h2>

          {/* Week Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="weekFilter"
              className="text-sm text-gray-600 font-medium"
            >
              Chuja kwa Wiki:
            </label>
            <select
              id="weekFilter"
              value={weekFilter}
              onChange={(e) => setWeekFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Zote</option>
              {weekNumbers.map((w) => (
                <option key={w} value={w}>
                  Wiki {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loadingJamii ? (
          <p className="text-gray-500">Inapakia rekodi...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-auto">
            <DataTable
              columns={["Member", "Afya", "Jamii", "Uendeshaji", "Week", "Date"]}
              rows={formatted}
            />
          </div>
        )}
      </div>
    </section>
  );
}
