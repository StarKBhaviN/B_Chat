import React, { createContext, useState, useContext } from "react";
import CustomAlert from "../components/Custom/CustomAlert";

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    confirmText: "OK",
    onConfirm: () => {},
  });

  const showAlert = (
    title,
    message,
    confirmText = "OK",
    onConfirm = () => {}
  ) => {
    setAlert({
      visible: true,
      title,
      message,
      confirmText,
      onConfirm,
    });
  };

  const hideAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert.visible && (
        <CustomAlert
          visible={alert.visible}
          title={alert.title}
          message={alert.message}
          confirmText={alert.confirmText}
          onConfirm={() => {
            alert.onConfirm();
            hideAlert();
          }}
        />
      )}
    </AlertContext.Provider>
  );
};
