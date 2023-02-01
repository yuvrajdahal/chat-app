import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { defaultError, errorSelector } from "../../appstate/error/error_slice";
import { useToast } from "../Toast";

const ErrorBoundaryContext = React.createContext(null);

export const ErrorBoundaryProvider = ({ children }) => {
  const { isError, error } = useSelector(errorSelector);
  const { add } = useToast();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isError) {
      add.error(error);
    }
    const timer = setTimeout(() => {
      dispatch(defaultError());
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [isError, error]);
  return (
    <ErrorBoundaryContext.Provider value={{}}>
      {children}
    </ErrorBoundaryContext.Provider>
  );
};
