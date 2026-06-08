import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

interface ToastContextType {
  showToast: (message: string) => void;
  toastMessage: string;
  toastVisible: boolean;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  toastMessage: '',
  toastVisible: false,
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToastMessage(message);
    setToastVisible(true);
    timeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toastMessage, toastVisible }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
