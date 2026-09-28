const fitsInBox = (box) => box.scrollHeight <= box.clientHeight + 1 && box.scrollWidth <= box.clientWidth + 1 &&
  [...box.children].every((child) => child.getBoundingClientRect().bottom <= box.getBoundingClientRect().bottom + 1);

const fitBox = (box) => {
  let size = Number(box.dataset.maxFont);
  const minimum = Number(box.dataset.minFont);
  box.style.fontSize = `${size}px`;
  while (!fitsInBox(box) && size > minimum) {
    size -= 0.25;
    box.style.fontSize = `${size}px`;
  }
  return fitsInBox(box);
};

const decodeArtwork = async (image) => {
  try { await image.decode(); }
  catch { image.style.display = "none"; } // A missing decoration must not hide the note.
};

export const preparePrintDocument = async (root, isCancelled) => {
  await document.fonts.ready;
  if (isCancelled()) return "cancelled";
  await Promise.all([...root.querySelectorAll("img")].map(decodeArtwork));
  if (isCancelled()) return "cancelled";
  if (![...root.querySelectorAll("[data-print-fit]")].every(fitBox)) return "overflow";
  root.dataset.ready = "true";
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  return isCancelled() ? "cancelled" : "ready";
};