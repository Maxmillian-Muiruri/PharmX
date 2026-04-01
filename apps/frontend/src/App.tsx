import { useContext } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { APPContext } from "./context";
import { Error404Page, ErrorPage } from "./components/dev/core";
import {
  AUTH_URL_PREFIX,
  CART_URL,
  LOGIN_URL,
  PRODUCTDETAIL_URL,
  PRODUCTLIST_URL,
  ROOT_URL_PREFIX,
  SIGNUP_URL,
} from "./utils";
import { Auth } from "./app/auth/page";
import RootLayout from "./app/layout";
import { HomePage } from "./app/page";
import { Signin } from "./app/auth/signin/page";
import { Signup } from "./app/auth/signup/page";
import { ProductList } from "./app/products/page";
import ProductsListLayout from "./app/products/layout";
import { ProductDetail } from "./app/products/product/page";
import { Cart } from "./app/cart/page";

function App() {
  const {} = useContext(APPContext);

  const router = createBrowserRouter([
    {
      errorElement: <ErrorPage />,
      Component: RootLayout,
      children: [
        {
          path: ROOT_URL_PREFIX,
          Component: HomePage,
          index: true,
        },

        // auth pages
        {
          Component: Auth,
          path: AUTH_URL_PREFIX,
          children: [
            {
              path: LOGIN_URL,
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
              path: PRODUCTDETAIL_URL,
              Component: ProductDetail,
            },
          ],
        },

        // cart
        {
          path: CART_URL,
          Component: Cart,
        },

        // Root level 404
        {
          Component: Error404Page,
          path: "*",
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
