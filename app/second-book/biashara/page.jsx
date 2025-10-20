"use client";
import { useEffect, useState } from "react";
import FormInput from "./../../components/FormInput";
import DataTable from "./../../components/DataTable";
import { useMembers } from "../../hooks/useMembers";
import { useLoans } from "../../hooks/useLoans";

export default function BusinessLoanPage() {
  const { members, loading: loadingMembers, fetchMembers } = useMembers();
  const { loans, loading: loadingLoans, fetchLoans, addLoan } = useLoans();

  const [form, setForm] = useState({
    member_id: "",
    tarehe: "",
    amount: "",
    nyongeza: "",
    bima: "",
    tarehe_kulejesha: "",
    aina_biashara: "",
  });

  useEffect(() => {
    fetchMembers();
    fetchLoans();
  }, []);

  const totalLoan =
    Number(form.amount || 0) + Number(form.nyongeza || 0);

  async function handleAdd(e) {
    e.preventDefault();

    if (!form.member_id || !form.amount) {
      alert("Tafadhali chagua mwanachama na weka kiasi cha mkopo!");
      return;
    }

    await addLoan({
      member_id: form.member_id,
      tarehe: form.tarehe,
      amount: form.amount,
      nyongeza: form.nyongeza,
      bima: form.bima,
      tarehe_kulejesha: form.tarehe_kulejesha,
      aina_biashara: form.aina_biashara,
    });

    setForm({
      member_id: "",
      tarehe: "",
      amount: "",
      nyongeza: "",
      bima: "",
      tarehe_kulejesha: "",
      aina_biashara: "",
    });

    fetchLoans();
  }

  const formatted = (loans || []).map((loan) => ({
    Namba: loan.member_number || "-",
    Jina: loan.member_name || "-",
    Jinsia: loan.member_gender || "-",
    "Tarehe ya kuchukua": new Date(loan.tarehe).toLocaleDateString(),
    Kiasi: loan.amount,
    Nyongeza: loan.nyongeza,
    "Jumla ya Mkopo": loan.total_loan,
    Bima: loan.bima,
    "Tarehe ya kulejesha": loan.tarehe_kulejesha
      ? new Date(loan.tarehe_kulejesha).toLocaleDateString()
      : "-",
    "Aina ya Biashara": loan.aina_biashara,
  }));

  return (
    <section className="max-w-6xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Mikopo ya Biashara (Business Loan)
      </h1>

      <form
        onSubmit={handleAdd}
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Member dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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

        <FormInput
          id="tarehe"
          label="Tarehe ya kuchukua mkopo"
          type="date"
          value={form.tarehe}
          onChange={(e) => setForm((f) => ({ ...f, tarehe: e.target.value }))}
        />

        <FormInput
          id="amount"
          label="Kiasi cha Mkopo"
          type="number"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
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
          id="tarehe_kulejesha"
          label="Tarehe ya Kulejesha"
          type="date"
          value={form.tarehe_kulejesha}
          onChange={(e) =>
            setForm((f) => ({ ...f, tarehe_kulejesha: e.target.value }))
          }
        />

        <FormInput
          id="aina_biashara"
          label="Aina ya Biashara"
          value={form.aina_biashara}
          onChange={(e) =>
            setForm((f) => ({ ...f, aina_biashara: e.target.value }))
          }
        />

        <div className="md:col-span-3 mt-4 text-right">
          <p className="text-gray-700 mb-2">
            <strong>Jumla ya Mkopo:</strong> {totalLoan.toLocaleString()} TZS
          </p>
          <button
            type="submit"
            className="px-5 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
          >
            Ongeza Mkopo
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Rekodi za Mikopo
        </h2>
        {loadingLoans ? (
          <p>Inapakia mikopo...</p>
        ) : (
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
              rows={formatted}
            />
          </div>
        )}
      </div>
    </section>
  );
}
