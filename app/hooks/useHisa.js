"use client";
import { useState } from "react";
import apiClient from "../lib/apiClient"; // adjust path if needed

export function useHisa() {
  const [hisaList, setHisaList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all hisa records
  async function fetchHisa() {
    setLoading(true);
    try {
      const res = await apiClient.get("members/hisa/list/");
      setHisaList(res.data);
      // console.log("Fetched Hisa records:", res.data);
    } catch (error) {
      // console.error("Failed to fetch Hisa records:", error);
    } finally {
      setLoading(false);
    }
  }

  // Add a new hisa record
  async function addHisa(data) {
    try {
      const payload = {
        member: parseInt(data.member_id), // ensure numeric ID
        kiasi: parseFloat(data.kiasi),    // ensure numeric amount
      };

      // console.log("📤 Sending Hisa data to backend:", data);
      // console.log("📦 Final payload being sent:", payload);

      await apiClient.post("members/hisa/add/", payload);
    } catch (error) {
      console.error(
        "Failed to add Hisa:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.error ||
          "Failed to add Hisa. Check your input data."
      );
    }
  }

  return { hisaList, loading, fetchHisa, addHisa };
}
