import { useContext } from "react";
import { Link, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { APPContext } from "./context";
import { Error404Page, ErrorPage } from "./components/dev/core";
import {
  AUTH_URL_PREFIX,
  CART_URL,
  PRODUCTLIST_URL,
  ROOT_URL_PREFIX,
  SIGNUP_URL,
} from "./utils";
import { Auth } from "./app/auth/page";
import { HomePage } from "./app/page";
import { Signin } from "./app/auth/signin/page";
import { Signup } from "./app/auth/signup/page";
import { ProductList } from "./app/products/page";
import ProductsListLayout from "./app/products/layout";
import { ProductDetail } from "./app/products/product/page";
import { Cart } from "./app/cart/page";

const AppLayout = () => {
  return (
    <div>
      <header className="w-full border-b border-neutral-200 px-4 py-3">
        <nav className="mx-auto flex max-w-5xl items-center gap-4 text-sm">
          <Link to={ROOT_URL_PREFIX}>Home</Link>
          <Link to={AUTH_URL_PREFIX}>Sign in</Link>
          <Link to={SIGNUP_URL}>Sign up</Link>
          <Link to={PRODUCTLIST_URL}>Products</Link>
          <Link to={CART_URL}>Cart</Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

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
