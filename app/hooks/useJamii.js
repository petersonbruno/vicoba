import { useState } from "react";
import apiClient from "../lib/apiClient"; // adjust path if needed

export function useJamii() {
  const [jamiiList, setJamiiList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchJamii() {
    setLoading(true);
    try {
      const res = await apiClient.get("members/jamii/list/");
      setJamiiList(res.data);
    } catch (error) {
      console.error("Failed to fetch Jamii records:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addJamii(data) {
    console.log("📤 Sending Jamii data to backend:", data);
    try {
      await apiClient.post("members/jamii/add/", {
        member: parseInt(data.member_id), // ensure numeric ID
        afya: parseFloat(data.afya),
        jamii: parseFloat(data.jamii),
        uendeshaji: parseFloat(data.uendeshaji),
        week_number: parseInt(data.week_number), // ensure numeric week number

      });
    } catch (error) {
      console.error("Failed to add Jamii:", error.response?.data || error.message);
      alert(
        error.response?.data?.error ||
          "Failed to add Jamii. Please check your input."
      );
    }
  }

  return { jamiiList, loading, fetchJamii, addJamii };
}
