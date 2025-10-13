"use client";
import { useState } from "react";
import FormInput from "./../../components/FormInput";
import DataTable from "./../../components/DataTable";

export default function JamiiLoanPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    namba: "",
    jina: "",
    jinsia: "Male",
    tarehe: "",
    kiasi: "",
    tareheKulejesha: "",
    mfuko: "",
    matumizi: "",
  });

  function addLoan(e) {
    e.preventDefault();
    const newRecord = {
      Namba: form.namba || "-",
      Jina: form.jina,
      Jinsia: form.jinsia,
      "Tarehe ya kuchukua": form.tarehe,
      Kiasi: form.kiasi,
      "Tarehe ya kulejesha": form.tareheKulejesha,
      "Mfuko wa Mkopo": form.mfuko,
      "Matumizi ya Mkopo": form.matumizi,
    };
    setRows((r) => [newRecord, ...r]);
    setForm({
      namba: "",
      jina: "",
      jinsia: "Male",
      tarehe: "",
      kiasi: "",
      tareheKulejesha: "",
      mfuko: "",
      matumizi: "",
    });
  }

  return (
    <section className="max-w-6xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mikopo wa Jamii</h1>

      <form
        onSubmit={addLoan}
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <FormInput
          id="namba"
          label="Namba ya Mwanachama"
          value={form.namba}
          onChange={(e) => setForm((f) => ({ ...f, namba: e.target.value }))}
        />
        <FormInput
          id="jina"
          label="Jina la Mkopaji"
          value={form.jina}
          onChange={(e) => setForm((f) => ({ ...f, jina: e.target.value }))}
        />
        <div>
          <label className="text-sm text-gray-600 font-medium mb-1 block">Jinsia</label>
          <select
            value={form.jinsia}
            onChange={(e) => setForm((f) => ({ ...f, jinsia: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <FormInput
          id="tarehe"
          label="Tarehe ya kuchukua mkopo"
          type="date"
          value={form.tarehe}
          onChange={(e) => setForm((f) => ({ ...f, tarehe: e.target.value }))}
        />
        <FormInput
          id="kiasi"
          label="Kiasi cha Mkopo"
          type="number"
          value={form.kiasi}
          onChange={(e) => setForm((f) => ({ ...f, kiasi: e.target.value }))}
        />
        <FormInput
          id="tareheKulejesha"
          label="Tarehe ya Kulejesha"
          type="date"
          value={form.tareheKulejesha}
          onChange={(e) => setForm((f) => ({ ...f, tareheKulejesha: e.target.value }))}
        />
        <FormInput
          id="mfuko"
          label="Mfuko wa Mkopo"
          value={form.mfuko}
          onChange={(e) => setForm((f) => ({ ...f, mfuko: e.target.value }))}
        />
        <FormInput
          id="matumizi"
          label="Matumizi ya Mkopo"
          value={form.matumizi}
          onChange={(e) => setForm((f) => ({ ...f, matumizi: e.target.value }))}
        />

        <div className="md:col-span-4 flex justify-end mt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
          >
            Add Loan
          </button>
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Jamii Loan Records</h2>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-auto">
          <DataTable
            columns={[
              "Namba",
              "Jina",
              "Jinsia",
              "Tarehe ya kuchukua",
              "Kiasi",
              "Tarehe ya kulejesha",
              "Mfuko wa Mkopo",
              "Matumizi ya Mkopo",
            ]}
            rows={rows}
          />
        </div>
      </div>
    </section>
  );
}
