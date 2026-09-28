const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const listeners = new Set();
const toastTimeouts = new Map();
let count = 0;
let memoryState = { toasts: [] };

export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST": return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case "UPDATE_TOAST": return { ...state, toasts: state.toasts.map((item) => item.id === action.toast.id ? { ...item, ...action.toast } : item) };
    case "DISMISS_TOAST": return { ...state, toasts: state.toasts.map((item) => item.id === action.toastId || action.toastId === undefined ? { ...item, open: false } : item) };
    case "REMOVE_TOAST": return { ...state, toasts: state.toasts.filter((item) => action.toastId !== undefined && item.id !== action.toastId) };
    default: return state;
  }
};

const addToRemoveQueue = (id) => {
  if (toastTimeouts.has(id)) return;
  toastTimeouts.set(id, setTimeout(() => {
    toastTimeouts.delete(id);
    dispatch({ type: "REMOVE_TOAST", toastId: id });
  }, TOAST_REMOVE_DELAY));
};

const dispatch = (action) => {
  if (action.type === "DISMISS_TOAST") {
    if (action.toastId) addToRemoveQueue(action.toastId);
    else memoryState.toasts.forEach((item) => addToRemoveQueue(item.id));
  }
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getSnapshot = () => memoryState;
export const dismiss = (toastId) => dispatch({ type: "DISMISS_TOAST", toastId });
export const toast = (props) => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  const id = count.toString();
  const update = (next) => dispatch({ type: "UPDATE_TOAST", toast: { ...next, id } });
  const close = () => dismiss(id);
  dispatch({ type: "ADD_TOAST", toast: { ...props, id, open: true, onOpenChange: (open) => { if (!open) close(); } } });
  return { id, dismiss: close, update };
};