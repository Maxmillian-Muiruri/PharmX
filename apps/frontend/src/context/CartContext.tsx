import { createContext, type ReactNode } from 'react';

export const CartContext = createContext<unknown>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  return (
    <CartContext.Provider value={{}}>
      {children}
    </CartContext.Provider>
  );
}
