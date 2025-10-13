import { useState, useEffect } from "react";

export default function useApi(apiFunc, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  async function request(...args) {
    try {
      setLoading(true);
      const result = await apiFunc(...args);
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (immediate) request();
  }, []);

  return { data, loading, error, request };
}
