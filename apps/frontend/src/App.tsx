import { useContext } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { APPContext } from "./context";
import { AppLayout, Error404Page, ErrorPage } from "./components/dev/core";
import {
  AUTH_URL_PREFIX,
  CART_URL,
  PRODUCTLIST_URL,
  // ROOT_URL_PREFIX,
  SIGNUP_URL,
} from "./utils";
import { Auth } from "./app/auth/page";
import { HomePage } from "./app/page";
import { AboutPage } from "./app/about/page";
import { ContactPage } from "./app/contact/page";
import { Signin } from "./app/auth/signin/page";
import { Signup } from "./app/auth/signup/page";
import { ProductList } from "./app/products/page";
import ProductsListLayout from "./app/products/layout";
import { ProductDetail } from "./app/products/product/page";
import { Cart } from "./app/cart/page";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";

function App() {
  const {} = useContext(APPContext);

  const router = createBrowserRouter([
    {
      errorElement: <ErrorPage />,
      Component: AppLayout,
      children: [
        {
          Component: HomePage,
          index: true,
        },

        // auth pages
        {
          Component: Auth,
          path: AUTH_URL_PREFIX,
          children: [
            {
              Component: Signin,
              index: true,
            },
            {
              path: SIGNUP_URL,
              Component: Signup,
            },
          ],
        },

        // core pages
        {
          path: "/about",
          Component: AboutPage,
        },

        // products
        {
          path: PRODUCTLIST_URL,
          Component: ProductsListLayout,
          children: [
            {
              Component: ProductList,
              index: true,
            },
            {
              path: ":id",
              Component: ProductDetail,
            },
          ],
        },

        // cart
        {
          path: CART_URL,
          Component: Cart,
        },

        // contact
        {
          path: "/contact",
          Component: ContactPage,
        },

        // Root level 404
        {
          Component: Error404Page,
          path: "*",
        },
      ],
    },
  ]);

  return (
    <ToastProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
