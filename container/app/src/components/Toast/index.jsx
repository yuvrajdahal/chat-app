import React, { useState } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { nanoid } from "@reduxjs/toolkit/src/nanoid";

const Toast = ({ children, id, type }) => {
  const { removeToast } = useToast();
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 3000); // delay

    return () => {
      clearTimeout(timer);
    };
  }, [id, removeToast]);
  const variants = {
    success: "toast-success",
    error: "toast-error",
  };
  const variantClass = variants[type];
  return <div className={variantClass}>{children}</div>;
};

const ToastContainer = ({ toasts }) => {
  return createPortal(
    <div className="absolute top-2 right-5">
      {toasts.map((item) => (
        <Toast key={item.id} id={item.id} type={item.type}>
          {item.content}
        </Toast>
      ))}
    </div>,
    document.body
  );
};
const ToastContext = React.createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToast] = useState([]);
  var id = nanoid();
  const add = {
    success: (content) => {
      setToast((toast) => [...toast, { id: id, content, type: "success" }]);
    },
    error: (content) => {
      setToast((toast) => [...toast, { id: id, content, type: "error" }]);
    },
  };
  const removeToast = (id) => {
    setToast((toasts) => toasts.filter((item) => item.id !== id));
  };
  return (
    <ToastContext.Provider value={{ add, removeToast }}>
      <ToastContainer toasts={toasts} />
      {children}
    </ToastContext.Provider>
  );
};
export function useToast() {
  const { ...prop } = React.useContext(ToastContext);
  return { ...prop };
}
