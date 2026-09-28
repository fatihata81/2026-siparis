import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { reportApiError } from "../lib/notifications";

// Each resource owns its request. Stale or unmounted requests cannot publish data.
export const useApiResource = (path, failureMessage) => {
  const [data, setData] = useState(null);
  const requestRef = useRef(null);
  const refresh = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await api.get(path, { signal: controller.signal });
      if (!controller.signal.aborted) setData(response.data);
    } catch (error) {
      if (!controller.signal.aborted) reportApiError(error, failureMessage, `load-${path.slice(1)}-error`);
    }
  }, [path, failureMessage]);

  useEffect(() => {
    refresh();
    return () => requestRef.current?.abort();
  }, [refresh]);

  return { data, refresh };
};