// hooks/useAttendances.js
import { useState } from "react";
import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const useAttendances = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/members/attendances/`);
      setAttendances(res.data);
    } catch (error) {
      console.error("Error fetching attendances:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addAttendance = async (attendanceData) => {
    try {
      console.log("📤 Sending to Django:", attendanceData);
      
      const res = await axios.post(
        `${API_BASE_URL}/members/attendances/`, 
        attendanceData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log("✅ Django response:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Django API error:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
      throw error;
    }
  };

  return { attendances, fetchAttendances, addAttendance, loading };
};