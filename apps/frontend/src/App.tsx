import { useContext } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { APPContext } from "./context";
import { Error404Page, ErrorPage } from "./components/dev/core";
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
import { Signin } from "./app/auth/signin/page";
import { Signup } from "./app/auth/signup/page";
import { ProductList } from "./app/products/page";
import ProductsListLayout from "./app/products/layout";
import { ProductDetail } from "./app/products/product/page";
import { Cart } from "./app/cart/page";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import { ChatBubble } from "./components/ChatBubble";
import { BackToTop } from "./components/BackToTop";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

const AppLayout = () => {
  return (
    <>
      <ScrollProgressBar />
      <AnnouncementBar />
      <div className="min-h-screen bg-slate-50 flex flex-col w-full">
        <Header />

        <main className="w-full flex-1 pt-16 md:pt-20">
          <Outlet />
        </main>

        <Footer />
      </div>
      <ChatBubble />
      <BackToTop />
    </>
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
