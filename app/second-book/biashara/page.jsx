// app/second-book/biashara/page.jsx
"use client";
import { useState } from "react";
import FormInput from "./../../components/FormInput";
import DataTable from "./../../components/DataTable";

export default function BiasharaLoanPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    namba: "", jina: "", jinsia: "Male", tarehe: "", kiasi: "", nyongeza: "", bima: "", tareheReturn: "", aina: ""
  });

  function add(e) {
    e.preventDefault();
    const jumla = Number(form.kiasi || 0) + Number(form.nyongeza || form.nyongeza === 0 ? form.nyongeza : 0);
    setRows(r => [{ "Namba": form.namba, "Jina": form.jina, "Kiasi": form.kiasi, "Nyongeza": form.nyongeza, "Jumla": jumla, "Bima": form.bima, "Tarehe Return": form.tareheReturn, "Aina": form.aina }, ...r]);
    setForm({ namba: "", jina: "", jinsia: "Male", tarehe: "", kiasi: "", nyongeza: "", bima: "", tareheReturn: "", aina: "" });
  }

  return (
    <section className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Mikopo ya Biashara</h1>

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
        <FormInput id="nyongeza" label="Nyongeza ya Mkopo" type="number" value={form.nyongeza} onChange={e=>setForm(f=>({...f,nyongeza:e.target.value}))} />
        <FormInput id="bima" label="Bima" value={form.bima} onChange={e=>setForm(f=>({...f,bima:e.target.value}))} />
        <FormInput id="tareheReturn" label="Tarehe ya Kulejesha" type="date" value={form.tareheReturn} onChange={e=>setForm(f=>({...f,tareheReturn:e.target.value}))} />
        <FormInput id="aina" label="Aina ya Biashara" value={form.aina} onChange={e=>setForm(f=>({...f,aina:e.target.value}))} />

        <div className="md:col-span-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Loan</button>
        </div>
      </form>

      <div className="mt-6">
        <DataTable columns={["Namba","Jina","Kiasi","Nyongeza","Jumla","Bima","Tarehe Return","Aina"]} rows={rows} />
      </div>
    </section>
  );
}
