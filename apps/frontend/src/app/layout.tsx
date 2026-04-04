import React from "react";
import { Outlet } from "react-router-dom";
import { LayoutWrapper } from "../components/dev/core";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";
import { Header } from "../components/Header";

export default function RootLayout() {
  return (
    <ToastProvider>
      <CartProvider>
        <LayoutWrapper
          {...{
            children: (
              <React.Fragment>
                <Header />
                <Outlet />
              </React.Fragment>
            ),
          }}
        />
      </CartProvider>
    </ToastProvider>
  );
}
