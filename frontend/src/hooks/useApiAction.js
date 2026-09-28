import { useCallback, useState } from "react";
import { notifySuccess, reportApiError } from "../lib/notifications";

export const useApiAction = () => {
  const [loading, setLoading] = useState(false);
  const execute = useCallback(async (operation, successMessage, failureMessage, useDetail = false) => {
    setLoading(true);
    try {
      await operation();
      notifySuccess(successMessage);
      return true;
    } catch (error) {
      reportApiError(error, failureMessage, "api-action-error", useDetail);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  return { loading, execute };
};