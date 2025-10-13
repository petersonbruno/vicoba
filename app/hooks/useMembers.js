"use client";
import { useState, useEffect } from "react";
import apiClient from "../lib/apiClient";

export function useMembers(autoFetch = true) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchMembers();
    }
  }, []);

  async function fetchMembers() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("members/list/");
      setMembers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch members:", err);
      setError("Imeshindwa kupakia orodha ya wanachama!");
    } finally {
      setLoading(false);
    }
  }

  async function addMember(memberData) {
    try {
      await apiClient.post("members/add/", memberData);
      await fetchMembers(); // ✅ Refresh list after adding
    } catch (err) {
      console.error("❌ Failed to add member:", err);
      alert("Imeshindwa kuongeza mwanachama!");
    }
  }

  return { members, loading, error, fetchMembers, addMember };
}
