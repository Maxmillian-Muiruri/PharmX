import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from "../app/layout"
import { HomePage } from "../app/page"
import { ProductList } from "../app/products/page"
import { ProductDetail } from "../app/products/product/page"
import type { TAppContextType } from "../types"

export const APPContext = React.createContext<TAppContextType>({})

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductList /> },
      { path: "/product/:id", element: <ProductDetail /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)