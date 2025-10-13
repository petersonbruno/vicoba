"use client";
import { useState } from "react";
import FormInput from "./../../components/FormInput";
import DataTable from "./../../components/DataTable";

export default function BusinessLoanPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    namba: "",
    jina: "",
    jinsia: "Male",
    tarehe: "",
    kiasi: "",
    nyongeza: "",
    bima: "",
    tareheKulejesha: "",
    ainaBiashara: "",
  });

  // Calculate total loan dynamically
  const totalLoan = Number(form.kiasi || 0) + Number(form.nyongeza || 0);

  function addLoan(e) {
    e.preventDefault();
    const newRecord = {
      Namba: form.namba || "-",
      Jina: form.jina,
      Jinsia: form.jinsia,
      "Tarehe ya kuchukua": form.tarehe,
      Kiasi: form.kiasi,
      Nyongeza: form.nyongeza,
      "Jumla ya Mkopo": totalLoan,
      Bima: form.bima,
      "Tarehe ya kulejesha": form.tareheKulejesha,
      "Aina ya Biashara": form.ainaBiashara,
    };
    setRows((r) => [newRecord, ...r]);
    setForm({
      namba: "",
      jina: "",
      jinsia: "Male",
      tarehe: "",
      kiasi: "",
      nyongeza: "",
      bima: "",
      tareheKulejesha: "",
      ainaBiashara: "",
    });
  }

  return (
    <section className="max-w-6xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mikopo ya Biashara (Business Loan)</h1>

      <form
        onSubmit={addLoan}
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4"
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
          id="nyongeza"
          label="Nyongeza ya Mkopo"
          type="number"
          value={form.nyongeza}
          onChange={(e) => setForm((f) => ({ ...f, nyongeza: e.target.value }))}
        />

        <FormInput
          id="bima"
          label="Bima"
          value={form.bima}
          onChange={(e) => setForm((f) => ({ ...f, bima: e.target.value }))}
        />
        <FormInput
          id="tareheKulejesha"
          label="Tarehe ya Kulejesha"
          type="date"
          value={form.tareheKulejesha}
          onChange={(e) => setForm((f) => ({ ...f, tareheKulejesha: e.target.value }))}
        />
        <FormInput
          id="ainaBiashara"
          label="Aina ya Biashara"
          value={form.ainaBiashara}
          onChange={(e) => setForm((f) => ({ ...f, ainaBiashara: e.target.value }))}
        />

        <div className="md:col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
          >
            Add Loan
          </button>
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Business Loans Records</h2>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-auto">
          <DataTable
            columns={[
              "Namba",
              "Jina",
              "Jinsia",
              "Tarehe ya kuchukua",
              "Kiasi",
              "Nyongeza",
              "Jumla ya Mkopo",
              "Bima",
              "Tarehe ya kulejesha",
              "Aina ya Biashara",
            ]}
            rows={rows}
          />
        </div>
      </div>
    </section>
  );
}
