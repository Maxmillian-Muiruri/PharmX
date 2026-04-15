import { createContext, type ReactNode } from 'react';

export const ToastContext = createContext<unknown>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <ToastContext.Provider value={{}}>
      {children}
    </ToastContext.Provider>
  );
}
