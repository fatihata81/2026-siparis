import { createElement } from "react";
import { toast } from "sonner";
import { getApiErrorMessage, isCancelledRequest } from "./api";

export const notifySuccess = (message) => toast.success(
  createElement("span", { "data-testid": "operation-success" }, message),
  { id: "operation-success" }
);

export const reportApiError = (error, fallback, testId = "api-error", useDetail = false) => {
  if (isCancelledRequest(error)) return;
  const message = useDetail ? getApiErrorMessage(error, fallback) : fallback;
  console.error(fallback, error);
  toast.error(createElement("span", { "data-testid": testId }, message), { id: testId });
};