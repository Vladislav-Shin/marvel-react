import { useCallback, useState } from "react";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (
    url, 
    method = "GET", 
    body = null, 
    header = {"Content-type": "application/json"}) => {

    setLoading(true);

    try {
      const responce = await fetch(url, {method, body, header});

      if (!responce) {
        throw new Error(`${responce.status}`)
      }

      const data = await responce.json();

      setLoading(false)
      return data;
      
    } catch(e) {
      setLoading(false);
      setError(e.message)
      throw e;
    }

  }, [])

  const clearError = useCallback(() => setError(null), []);

  return {loading, error, request, clearError}
}
