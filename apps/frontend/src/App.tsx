import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AppLayout, Error404Page, ErrorPage } from "./components/dev/core";
import {
  AUTH_URL_PREFIX,
  CART_URL,
  CHECKOUT_URL,
  ORDERS_URL,
  ORDERDETAIL_URL,
  PRESCRIPTIONS_URL,
  PRESCRIPTION_URL,
  PRODUCTLIST_URL,
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
import { Checkout } from "./app/checkout/page";
import MyOrders from "./app/my-orders/page";
import UploadPrescription from "./app/prescription/page";
import MyPrescriptions from "./app/prescriptions/page";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";
import { TrackOrder } from "./trackorder/OrderTracking";

function App() {
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

        // checkout
        {
          path: CHECKOUT_URL,
          Component: Checkout,
        },

        // upload prescription
        {
          path: PRESCRIPTION_URL,
          Component: UploadPrescription,
        },

        // my prescriptions
        {
          path: PRESCRIPTIONS_URL,
          Component: MyPrescriptions,
        },

        // my-orders
        {
          path: ORDERS_URL,
          Component: MyOrders,
        },

        // contact
        {
          path: "/contact",
          Component: ContactPage,
        },

        // track order
        {
          path: "/TrackOrder",
          Component: TrackOrder,
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
