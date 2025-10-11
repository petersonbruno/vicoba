"use client";
import { useState } from "react";
import FormInput from "./../../components/FormInput";
import DataTable from "./../../components/DataTable";

export default function HisaPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ namba: "", mahudhurio: "", hisa: "" });

  function add(e) {
    e.preventDefault();
    setRows((r) => [
      { Namba: form.namba || "-", Mahudhurio: form.mahudhurio, Hisa: form.hisa },
      ...r,
    ]);
    setForm({ namba: "", mahudhurio: "", hisa: "" });
  }

  return (
    <section className="max-w-5xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Hisa za Wanachama</h1>

      <form
        onSubmit={add}
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <FormInput
          id="namba"
          label="Namba ya Mwanachama (auto)"
          value={form.namba}
          onChange={(e) => setForm((f) => ({ ...f, namba: e.target.value }))}
        />
        <FormInput
          id="mahd"
          label="Mahudhurio ya Mwanachama"
          type="number"
          value={form.mahudhurio}
          onChange={(e) => setForm((f) => ({ ...f, mahudhurio: e.target.value }))}
        />
        <FormInput
          id="hisa"
          label="Hisa"
          type="number"
          value={form.hisa}
          onChange={(e) => setForm((f) => ({ ...f, hisa: e.target.value }))}
        />

        <div className="md:col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
          >
            Add Record
          </button>
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Hisa Records</h2>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-auto">
          <DataTable columns={["Namba", "Mahudhurio", "Hisa"]} rows={rows} />
        </div>
      </div>
    </section>
  );
}
