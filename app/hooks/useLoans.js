// app/hooks/useLoans.js
import { useState } from "react";
import apiClient from "../lib/apiClient";

export function useLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all loans
  async function fetchLoans() {
    setLoading(true);
    try {
      const res = await apiClient.get("members/loans/");
      setLoans(res.data);
    } catch (error) {
      console.error(
        "Failed to fetch loans:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }

  // Add a new loan
  //    async function addLoan(loan) {
  //   try {
  //     const res = await fetch(API_URL, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         member: loan.member_id,
  //         jinsia: loan.jinsia || "M",
  //         amount: loan.kiasi,
  //         nyongeza: loan.nyongeza,
  //         bima: loan.bima,
  //         aina_biashara: loan.ainaBiashara,
  //         tarehe: loan.tarehe,
  //         tarehe_kulejesha: loan.tareheKulejesha,
  //       }),
  //     });

  //     if (!res.ok) {
  //       const err = await res.text();
  //       throw new Error(`Failed to add loan: ${err}`);
  //     }

  //     await fetchLoans();
  //   } catch (error) {
  //     console.error("Error adding loan:", error);
  //     alert("Error saving loan to backend.");
  //   }
  // }
  async function addLoan(data) {
    try {
      const payload = {
        member: parseInt(data.member_id), // Foreign key
        jinsia: data.jinsia || "Me", // Must match Django choices: "Me" or "Ke"
        amount: parseFloat(data.amount),
        nyongeza: parseFloat(data.nyongeza) || 0,
        bima: data.bima || "",
        aina_biashara: data.aina_biashara || "",
        tarehe: data.tarehe
          ? new Date(data.tarehe).toISOString().split("T")[0]
          : null,
        tarehe_kulejesha: data.tarehe_kulejesha
          ? new Date(data.tarehe_kulejesha).toISOString().split("T")[0]
          : null,
      };

      console.log("📤 Sending loan payload:", payload);

      // const res = await apiClient.post("members/loans/", payload);
      // console.log("✅ Loan added successfully:", res.data);
      alert("Mkopo umeongezwa kwa mafanikio!");
      await fetchLoans();
    } catch (error) {
      console.error(
        "❌ Failed to add loan:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.error ||
          "Imeshindikana kuongeza mkopo. Hakikisha taarifa zako ni sahihi."
      );
    }
  }

  return { loans, loading, fetchLoans, addLoan };
}
