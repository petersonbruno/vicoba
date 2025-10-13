"use client";
import { useEffect, useState } from "react";
import FormInput from "./../../components/FormInput";
import DataTable from "./../../components/DataTable";
import { useMembers } from "../../hooks/useMembers";
import { useJamii } from "../../hooks/useJamii"; // new hook

export default function JamiiPage() {
  const { members, loading: loadingMembers, fetchMembers } = useMembers();
  const { jamiiList, loading: loadingJamii, fetchJamii, addJamii } = useJamii();

  const [form, setForm] = useState({
    member_id: "",
    afya: "",
    jamii: "",
    uendeshaji: "",
  });

  useEffect(() => {
    fetchMembers();
    fetchJamii();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();

    const { member_id, afya, jamii, uendeshaji } = form;
    if (!member_id || !afya || !jamii || !uendeshaji) {
      alert("Tafadhali jaza viwanja vyote vya Afya, Jamii na Uendeshaji!");
      return;
    }

    try {
      await addJamii({
        member_id,
        afya,
        jamii,
        uendeshaji,
      });

      setForm({ member_id: "", afya: "", jamii: "", uendeshaji: "" });
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

  const formatted = (jamiiList || []).map((j) => ({
    Member: j.member_name || "-",
    Afya: j.afya,
    Jamii: j.jamii,
    Uendeshaji: j.uendeshaji,
    Date: new Date(j.tarehe).toLocaleString(),
  }));

  return (
    <section className="max-w-5xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Michango ya Jamii
      </h1>

      {/* --- Add Jamii Form --- */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Member dropdown */}
        <div className="md:col-span-1">
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

        {/* Afya, Jamii, Uendeshaji Inputs */}
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

        {/* Submit button */}
        <div className="md:col-span-4 flex justify-end mt-4">
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
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Rekodi za Michango ya Jamii
        </h2>
        {loadingJamii ? (
          <p>Loading Jamii records...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-auto">
            <DataTable
              columns={["Member", "Afya", "Jamii", "Uendeshaji", "Date"]}
              rows={formatted}
            />
          </div>
        )}
      </div>
    </section>
  );
}
