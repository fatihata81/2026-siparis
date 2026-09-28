import { createElement, useEffect } from "react";
import { toast } from "sonner";
import { preparePrintDocument } from "../lib/printPreparation";

const printError = (id, message) => toast.error(createElement("span", { "data-testid": id }, message), { id });

export const usePrintLifecycle = (rootRef, job, onComplete) => {
  useEffect(() => {
    let cancelled = false;
    let started = false;
    const afterPrint = () => { if (started) onComplete(); };
    window.addEventListener("afterprint", afterPrint);
    const prepare = async () => {
      try {
        if (!rootRef.current) return;
        const result = await preparePrintDocument(rootRef.current, () => cancelled);
        if (result === "cancelled") return;
        if (result === "overflow") {
          printError("print-overflow-error", "Metin seçilen kağıt boyutuna sığmıyor. Lütfen metni kısaltıp yeniden yazdırın.");
          onComplete();
          return;
        }
        started = true;
        window.print(); // Remain mounted until afterprint, including non-blocking browsers.
      } catch {
        if (!cancelled) {
          printError("print-error", "Yazdırma hazırlanamadı. Lütfen yeniden deneyin.");
          onComplete();
        }
      }
    };
    prepare();
    return () => {
      cancelled = true;
      window.removeEventListener("afterprint", afterPrint);
    };
  }, [rootRef, job, onComplete]);
};