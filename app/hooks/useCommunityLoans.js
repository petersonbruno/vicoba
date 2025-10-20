"use client";
import { useState } from "react";
import apiClient from "../lib/apiClient";

export function useCommunityLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchLoans() {
    try {
      setLoading(true);
      const res = await apiClient.get("members/community-loans/");
      setLoans(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch community loans:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function addLoan(data) {
    try {
      const payload = {
        member: parseInt(data.member_id),
        jinsia: data.jinsia || "Me",
        amount: parseFloat(data.amount),
        mfuko_wa_mkopo: data.mfuko_wa_mkopo,
        matumizi_ya_mkopo: data.matumizi_ya_mkopo,
        tarehe: data.tarehe
          ? new Date(data.tarehe).toISOString().split("T")[0]
          : null,
        tarehe_kulejesha: data.tarehe_kulejesha
          ? new Date(data.tarehe_kulejesha).toISOString().split("T")[0]
          : null,
      };

      await apiClient.post("members/community-loans/", payload);
      await fetchLoans();
    } catch (error) {
      console.error(
        "❌ Failed to add community loan:",
        error.response?.data || error.message
      );
      alert(
        "Kuna tatizo wakati wa kuongeza mkopo wa jamii. Tafadhali jaribu tena."
      );
    }
  }

  return { loans, loading, fetchLoans, addLoan };
}
