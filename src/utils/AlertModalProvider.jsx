import { createContext, useState, useContext } from "react";
import AlertModal from "../components/AlertModal";

const AlertModalContext = createContext();

export function AlertModalProvider({ children }) {
  const [alertModalState, setAlertModalState] = useState({
    open: false,
    title: "",
    message: "",
    resolve: null,
  });

  function showAlertModal(title, message) {
    return new Promise((resolve) => {
      setAlertModalState({
        open: true,
        title,
        message,
        resolve,
      });
    });
  }

  function handleAlertModalClose() {
    setAlertModalState((prev) => {
      if (prev.resolve) prev.resolve(); // resolve the promise when OK is clicked
      return { ...prev, open: false };
    });
  }

  return (
    <AlertModalContext.Provider value={showAlertModal}>
      {children}
      <AlertModal
        open={alertModalState.open}
        onClose={handleAlertModalClose}
        title={alertModalState.title}
        message={alertModalState.message}
      />
    </AlertModalContext.Provider>
  );
}

export function useAlertModal() {
  return useContext(AlertModalContext);
}
