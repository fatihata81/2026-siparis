"use client";
import { useSyncExternalStore } from "react";
import { dismiss, getSnapshot, subscribe, toast } from "../lib/toastStore";

export { reducer, toast } from "../lib/toastStore";

export const useToast = () => {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { ...state, toast, dismiss };
};