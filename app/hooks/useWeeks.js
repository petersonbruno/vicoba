// hooks/useWeeks.js
import { useState } from "react";
import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const useWeeks = () => {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWeeks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/members/weeks/list/`);
      setWeeks(res.data);
    } catch (error) {
      console.error("Error fetching weeks:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addWeek = async (weekData) => {
    try {
      console.log("📤 Sending week to Django:", weekData);
      
      const res = await axios.post(
        `${API_BASE_URL}/members/weeks/add/`, 
        weekData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log("✅ Django week response:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Django week API error:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
      throw error;
    }
  };

  return { weeks, fetchWeeks, addWeek, loading };
};