// app/second-book/jamii/page.jsx
"use client";
import { useState } from "react";
import FormInput from "./../../components/FormInput";
import DataTable from "./../../components/DataTable";

export default function JamiiLoanPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ namba: "", jina: "", jinsia: "Male", tarehe: "", kiasi: "", tareheReturn: "", mfuko: "", matumizi: "" });

  function add(e) {
    e.preventDefault();
    setRows(r => [{ "Namba": form.namba, "Jina": form.jina, "Kiasi": form.kiasi, "TareheReturn": form.tareheReturn, "Mfuko": form.mfuko, "Matumizi": form.matumizi }, ...r]);
    setForm({ namba: "", jina: "", jinsia: "Male", tarehe: "", kiasi: "", tareheReturn: "", mfuko: "", matumizi: "" });
  }

  return (
    <section className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Add Mkopo wa Jamii</h1>

      <form onSubmit={add} className="bg-white p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput id="namba" label="Namba ya Mwanachama" value={form.namba} onChange={e=>setForm(f=>({...f,namba:e.target.value}))} />
        <FormInput id="jina" label="Jina la Mkopaji" value={form.jina} onChange={e=>setForm(f=>({...f,jina:e.target.value}))} />
        <div>
          <label className="text-sm text-gray-600">Jinsia</label>
          <select value={form.jinsia} onChange={(e)=>setForm(f=>({...f,jinsia:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2">
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <FormInput id="tarehe" label="Tarehe ya kuchukua mkopo" type="date" value={form.tarehe} onChange={e=>setForm(f=>({...f,tarehe:e.target.value}))} />
        <FormInput id="kiasi" label="Kiasi cha Mkopo" type="number" value={form.kiasi} onChange={e=>setForm(f=>({...f,kiasi:e.target.value}))} />
        <FormInput id="tareheReturn" label="Tarehe ya Kulejesha" type="date" value={form.tareheReturn} onChange={e=>setForm(f=>({...f,tareheReturn:e.target.value}))} />
        <FormInput id="mfuko" label="Mfuko wa Mkopo" value={form.mfuko} onChange={e=>setForm(f=>({...f,mfuko:e.target.value}))} />
        <FormInput id="matumizi" label="Matumizi ya Mkopo" value={form.matumizi} onChange={e=>setForm(f=>({...f,matumizi:e.target.value}))} />

        <div className="md:col-span-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Loan</button>
        </div>
      </form>

      <div className="mt-6">
        <DataTable columns={["Namba","Jina","Kiasi","TareheReturn","Mfuko","Matumizi"]} rows={rows} />
      </div>
    </section>
  );
}
