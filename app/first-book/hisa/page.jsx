"use client";
import { useEffect, useState } from "react";
import FormInput from "./../../components/FormInput";
import DataTable from "./../../components/DataTable";
import { useMembers } from "../../hooks/useMembers";
import { useHisa } from "../../hooks/useHisa";

export default function HisaPage() {
  const { members, loading: loadingMembers, fetchMembers } = useMembers();
  const { hisaList, loading: loadingHisa, fetchHisa, addHisa } = useHisa();

  const [form, setForm] = useState({ member_id: "", kiasi: "" });

  // Load members + hisa records
  useEffect(() => {
    fetchMembers();
    fetchHisa();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();

    if (!form.member_id || !form.kiasi) {
      alert("Please select a member and enter Hisa amount!");
      return;
    }

    try {
      // Send only ID and numeric value
      await addHisa({
        member_id: form.member_id,
        kiasi: form.kiasi,
      });

      // Reset form and refresh table
      setForm({ member_id: "", kiasi: "" });
      fetchHisa();
    } catch (error) {
      console.error(
        "Failed to add Hisa:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.error ||
          "Failed to add Hisa. Check your input data."
      );
    }
  }

  // Format table for display
  const formatted = (hisaList || []).map((h) => ({
    Member: h.member_name || "-",
    Hisa: h.kiasi,
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
            value={form.member_id} // <-- use member_id here
            onChange={(e) =>
              setForm((f) => ({ ...f, member_id: e.target.value }))
            } // <-- update member_id
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">
              {loadingMembers ? "Loading..." : "Tafuta Mwanachama"}
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
          label="Hisa Amount (TZS)"
          type="number"
          value={form.kiasi}
          onChange={(e) => setForm((f) => ({ ...f, kiasi: e.target.value }))}
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
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
         Rekodi za Hisa
        </h2>
        {loadingHisa ? (
          <p>Loading Hisa records...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-auto">
            <DataTable columns={["Member", "Hisa", "Date"]} rows={formatted} />
          </div>
        )}
      </div>
    </section>
  );
}
