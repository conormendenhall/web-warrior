import { useEffect } from "react";

import "./Toast.scss";

export const Toast = ({ toast, setToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast("");
    }, 1500);
    return () => clearTimeout(timer);
  }, [toast, setToast]);

  return toast && <h1 className="toast">{toast}</h1>;
};
