import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import PrintLabel from "./PrintLabel";
import PrintNote from "./PrintNote";
import "./print.css";

// Measure the actual text instead of guessing from its character count.
const fitContent = (root) => [...root.querySelectorAll("[data-print-fit]")].every((box) => {
  const fits = () => box.scrollHeight <= box.clientHeight + 1 && box.scrollWidth <= box.clientWidth + 1 &&
    [...box.children].every((child) => child.getBoundingClientRect().bottom <= box.getBoundingClientRect().bottom + 1);
  let size = Number(box.dataset.maxFont);
  const minimum = Number(box.dataset.minFont);
  box.style.fontSize = `${size}px`;
  while (!fits() && size > minimum) {
    size -= 0.25;
    box.style.fontSize = `${size}px`;
  }
  return fits();
});

export const PrintJob = ({ job, onComplete }) => {
  const rootRef = useRef(null);
  const isNote = job.type === "note";

  useEffect(() => {
    let cancelled = false;
    let started = false;
    const afterPrint = () => { if (started) onComplete(); };
    window.addEventListener("afterprint", afterPrint);

    const prepare = async () => {
      try {
        await document.fonts.ready;
        const root = rootRef.current;
        if (cancelled || !root) return;
        await Promise.all([...root.querySelectorAll("img")].map(async (image) => {
          try {
            await image.decode();
          } catch {
            // A missing decoration must never hide the customer's note.
            image.style.display = "none";
          }
        }));
        if (cancelled) return;
        if (!fitContent(root)) {
          toast.error(<span data-testid="print-overflow-error">Metin seçilen kağıt boyutuna sığmıyor. Lütfen metni kısaltıp yeniden yazdırın.</span>);
          onComplete();
          return;
        }
        root.dataset.ready = "true";
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (!cancelled) {
          started = true;
          window.print();
          // Keep the document mounted until afterprint, including non-blocking browsers.
        }
      } catch {
        if (!cancelled) {
          toast.error(<span data-testid="print-error">Yazdırma hazırlanamadı. Lütfen yeniden deneyin.</span>);
          onComplete();
        }
      }
    };
    prepare();
    return () => {
      cancelled = true;
      window.removeEventListener("afterprint", afterPrint);
    };
  }, [job, onComplete]);

  return createPortal(
    <div id="order-print-root" className={isNote ? "print-job-note" : "print-job-label"} ref={rootRef} data-testid="print-document">
      <style>{`@media print { @page { size: ${isNote ? "80mm 50mm" : "100mm 100mm"}; margin: 0; } }`}</style>
      {isNote ? <PrintNote order={job.order} /> : <PrintLabel order={job.order} />}
    </div>,
    document.body
  );
};