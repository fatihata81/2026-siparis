import { useRef } from "react";
import { createPortal } from "react-dom";
import { usePrintLifecycle } from "../hooks/usePrintLifecycle";
import PrintLabel from "./PrintLabel";
import PrintNote from "./PrintNote";
import "./print.css";

export const PrintJob = ({ job, onComplete }) => {
  const rootRef = useRef(null);
  const isNote = job.type === "note";
  usePrintLifecycle(rootRef, job, onComplete);
  return createPortal(
    <div id="order-print-root" className={isNote ? "print-job-note" : "print-job-label"} ref={rootRef} data-testid="print-document">
      <style>{`@media print { @page { size: ${isNote ? "80mm 50mm" : "100mm 100mm"}; margin: 0; } }`}</style>
      {isNote ? <PrintNote order={job.order} /> : <PrintLabel order={job.order} />}
    </div>, document.body
  );
};