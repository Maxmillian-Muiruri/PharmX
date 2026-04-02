import { useContext } from "react";
import {
  NavLink,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
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
  const navItems = [
    { to: ROOT_URL_PREFIX, label: "Home" },
    { to: AUTH_URL_PREFIX, label: "Sign in" },
    { to: SIGNUP_URL, label: "Sign up" },
    { to: PRODUCTLIST_URL, label: "Products" },
    { to: CART_URL, label: "Cart" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 w-full border-b border-slate-200/70 bg-white/95 px-5 py-5 shadow-sm backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <NavLink
            className="text-2xl font-semibold tracking-tight text-slate-900"
            to={ROOT_URL_PREFIX}
          >
            PharmX
          </NavLink>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-100/80 p-2">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `rounded-xl px-5 py-2.5 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-700 hover:bg-white hover:text-slate-900"
                  }`
                }
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
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
