// app/first-book/jamii/page.jsx
"use client";
import { useState } from "react";
import FormInput from "./../../components/FormInput";
import DataTable from "./../../components/DataTable";

export default function JamiiPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ afya: "", jamii: "", uendeshaji: "" });

  function add(e) {
    e.preventDefault();
    setRows(r => [{ Afya: form.afya, Jamii: form.jamii, Uendeshaji: form.uendeshaji }, ...r]);
    setForm({ afya: "", jamii: "", uendeshaji: "" });
  }

  return (
    <section className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Jamii za Wanachama</h1>

      <form onSubmit={add} className="bg-white p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput id="afya" label="Afya" type="number" value={form.afya} onChange={e=>setForm(f=>({...f,afya:e.target.value}))} />
        <FormInput id="jamii" label="Jamii" type="number" value={form.jamii} onChange={e=>setForm(f=>({...f,jamii:e.target.value}))} />
        <FormInput id="uend" label="Uendeshaji" type="number" value={form.uendeshaji} onChange={e=>setForm(f=>({...f,uendeshaji:e.target.value}))} />

        <div className="md:col-span-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Record</button>
        </div>
      </form>

      <div className="mt-6">
        <DataTable columns={["Afya","Jamii","Uendeshaji"]} rows={rows} />
      </div>
    </section>
  );
}
