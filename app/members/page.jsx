"use client";
import { useEffect, useState } from "react";
import { useMembers } from "./../hooks/useMembers";
import DataTable from "./../components/DataTable";

export default function MembersPage() {
  const { members, loading, fetchMembers, addMember } = useMembers();
  const [form, setForm] = useState({
    namba: "",
    fname: "",
    lname: "",
    jinsia: "Me",
    hisa_anzia: "",
    jamii_anzia: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.namba || !form.fname || !form.lname) {
      alert("Tafadhali jaza taarifa zote muhimu.");
      return;
    }

    await addMember(form);
    setForm({
      namba: "",
      fname: "",
      lname: "",
      jinsia: "Me",
      hisa_anzia: "",
      jamii_anzia: "",
    });
    fetchMembers();
  };

  const formatted = (members || []).map((m) => ({
    Namba: m.namba,
    Jina: `${m.fname} ${m.lname}`,
    Jinsia: m.jinsia,
    Hisa_Anzia: m.hisa_anzia,
    Jamii_Anzia: m.jamii_anzia,
  }));

  return (
    <section className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
        Sajili Mwana Kikundi
      </h1>

      {/* --- Add Member Form --- */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-12"
      >
        {[ 
          { id: "namba", label: "Namba ya Mwanachama", type: "text" },
          { id: "fname", label: "Jina la Kwanza", type: "text" },
          { id: "lname", label: "Jina la Mwisho", type: "text" },
          { id: "hisa_anzia", label: "Hisa Anzia", type: "number" },
          { id: "jamii_anzia", label: "Jamii Anzia", type: "number" },
        ].map((field) => (
          <div key={field.id}>
            <label className="text-sm text-gray-500 font-semibold mb-2 block">
              {field.label}
            </label>
            <input
              type={field.type}
              value={form[field.id]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [field.id]: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            />
          </div>
        ))}

        {/* Jinsia */}
        <div>
          <label className="text-sm text-gray-500 font-semibold mb-2 block">
            Jinsia
          </label>
          <select
            value={form.jinsia}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, jinsia: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
          >
            <option value="Me">ME</option>
            <option value="Ke">KE</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="md:col-span-3 flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition"
          >
            Sajili Mwanachama
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({
                namba: "",
                fname: "",
                lname: "",
                jinsia: "Me",
                hisa_anzia: "",
                jamii_anzia: "",
              })
            }
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
          >
            Futa Fomu
          </button>
        </div>
      </form>

      {/* --- Members Table --- */}
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        Orodha ya Wanachama
      </h2>
      {loading ? (
        <p className="text-gray-500">Inapakia wanachama...</p>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-auto">
          <DataTable
            columns={["Namba", "Jina", "Jinsia", "Hisa_Anzia", "Jamii_Anzia"]}
            rows={formatted}
          />
        </div>
      )}
    </section>
  );
}
