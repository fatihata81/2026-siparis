import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { reportApiError } from "../lib/notifications";

const EMPTY_DISTRICTS = [];

export const useDistricts = (province) => {
  const [result, setResult] = useState({ province: null, districts: EMPTY_DISTRICTS });
  useEffect(() => {
    if (!province) return;
    const controller = new AbortController();
    const load = async () => {
      try {
        const { data } = await api.get(`/districts/${encodeURIComponent(province)}`, { signal: controller.signal });
        if (!controller.signal.aborted) setResult({ province, districts: data.districts });
      } catch (error) {
        if (!controller.signal.aborted) reportApiError(error, "İlçeler yüklenemedi", "districts-error");
      }
    };
    load();
    return () => controller.abort();
  }, [province]);
  return result.province === province ? result.districts : EMPTY_DISTRICTS;
};