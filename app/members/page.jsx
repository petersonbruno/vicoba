"use client";
import { useState } from "react";
import FormInput from "./../components/FormInput";
import DataTable from "./../components/DataTable";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ fname: "", lname: "", jinsia: "Male" });

  function handleAdd(e) {
    e.preventDefault();
    const id = String(members.length + 1).padStart(3, "0");
    const newMember = {
      Namba: id,
      Jina: `${form.fname} ${form.lname}`,
      Jinsia: form.jinsia,
    };
    setMembers((s) => [newMember, ...s]);
    setForm({ fname: "", lname: "", jinsia: "Male" });
  }

  return (
    <section className="max-w-5xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Register Member</h1>

      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
      >
        <FormInput
          id="fname"
          label="First name"
          value={form.fname}
          onChange={(e) => setForm((f) => ({ ...f, fname: e.target.value }))}
        />
        <FormInput
          id="lname"
          label="Last name"
          value={form.lname}
          onChange={(e) => setForm((f) => ({ ...f, lname: e.target.value }))}
        />
        <div>
          <label className="text-sm text-gray-600 font-medium mb-1 block">Jinsia</label>
          <select
            value={form.jinsia}
            onChange={(e) => setForm((f) => ({ ...f, jinsia: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          >
            <option>ME</option>
            <option>KE</option>
          </select>
        </div>

        <div className="md:col-span-3 flex gap-3 mt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
          >
            Register Member
          </button>
          <button
            type="button"
            onClick={() => setMembers([])}
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Clear List
          </button>
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Members List</h2>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-auto">
          <DataTable columns={["Namba", "Jina", "Jinsia"]} rows={members} />
        </div>
      </div>
    </section>
  );
}
