"use client";
import { useEffect, useState } from "react";
import FormInput from "./../../components/FormInput";
import DataTable from "./../../components/DataTable";
import { useMembers } from "../../hooks/useMembers";
import { useCommunityLoans } from "../../hooks/useCommunityLoans";

export default function CommunityLoanPage() {
  const { members, loading: loadingMembers, fetchMembers } = useMembers();
  const {
    loans,
    loading: loadingLoans,
    fetchLoans,
    addLoan,
  } = useCommunityLoans();

  const [form, setForm] = useState({
    member_id: "",
    jinsia: "",
    amount: "",
    mfuko_wa_mkopo: "",
    matumizi_ya_mkopo: "",
    tarehe: "",
    tarehe_kulejesha: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchMembers();
    fetchLoans();
  }, []);

  const selectedMember = members.find((m) => m.id === Number(form.member_id));

  // Automatically fill gender when member selected
  useEffect(() => {
    if (selectedMember) {
      setForm((f) => ({
        ...f,
        jinsia: selectedMember.jinsia,
      }));
    }
  }, [selectedMember]);

  async function handleAdd(e) {
    e.preventDefault();

    // Simple form validation
    if (!form.member_id) {
      setMessage({ type: "error", text: "Tafadhali chagua mwanachama." });
      return;
    }
    if (!form.amount) {
      setMessage({ type: "error", text: "Tafadhali weka kiasi cha mkopo." });
      return;
    }

    try {
      await addLoan(form);
      setMessage({ type: "success", text: "Mkopo umeongezwa kwa mafanikio!" });

      // Reset form after success
      setForm({
        member_id: "",
        jinsia: "",
        amount: "",
        mfuko_wa_mkopo: "",
        matumizi_ya_mkopo: "",
        tarehe: "",
        tarehe_kulejesha: "",
      });

      fetchLoans();
    } catch (err) {
      setMessage({ type: "error", text: "Kuna tatizo wakati wa kuongeza mkopo." });
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  }

  const formatted = (loans || []).map((loan) => ({
    Namba: loan.member_number || "-",
    Jina: loan.member_name || "-",
    Jinsia: loan.member_gender || "-",
    "Tarehe ya Kuchukua": new Date(loan.tarehe).toLocaleDateString(),
    Kiasi: loan.amount,
    "Tarehe ya Kulejesha": loan.tarehe_kulejesha
      ? new Date(loan.tarehe_kulejesha).toLocaleDateString()
      : "-",
    "Mfuko wa Mkopo": loan.mfuko_wa_mkopo || "-",
    "Matumizi ya Mkopo": loan.matumizi_ya_mkopo || "-",
  }));

  return (
    <section className="max-w-6xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Mikopo ya Jamii (Community Loans)
      </h1>

      {/* Message alert */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg text-white ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Loan Form */}
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

        {/* Jinsia (auto-filled) */}

        <FormInput
          id="amount"
          label="Kiasi cha Mkopo"
          type="number"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
        />

        <FormInput
          id="mfuko_wa_mkopo"
          label="Mfuko wa Mkopo"
          value={form.mfuko_wa_mkopo}
          onChange={(e) =>
            setForm((f) => ({ ...f, mfuko_wa_mkopo: e.target.value }))
          }
        />

        <FormInput
          id="matumizi_ya_mkopo"
          label="Matumizi ya Mkopo"
          value={form.matumizi_ya_mkopo}
          onChange={(e) =>
            setForm((f) => ({ ...f, matumizi_ya_mkopo: e.target.value }))
          }
        />

        <FormInput
          id="tarehe"
          label="Tarehe ya Kuchukua"
          type="date"
          value={form.tarehe}
          onChange={(e) => setForm((f) => ({ ...f, tarehe: e.target.value }))}
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

        <div className="md:col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
          >
            Ongeza Mkopo wa Jamii
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Rekodi za Mikopo ya Jamii
        </h2>
        {loadingLoans ? (
          <p>Loading loans...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-auto">
            <DataTable
              columns={[
                "Namba",
                "Jina",
                "Jinsia",
                "Tarehe ya Kuchukua",
                "Kiasi",
                "Tarehe ya Kulejesha",
                "Mfuko wa Mkopo",
                "Matumizi ya Mkopo",
              ]}
              rows={formatted}
            />
          </div>
        )}
      </div>
    </section>
  );
}
