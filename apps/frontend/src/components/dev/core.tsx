import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { TNodeChildrentType } from "../../types";
import { APPContext } from "../../context";
import { ROOT_URL_PREFIX } from "../../utils";
import { useNavigate } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { Outlet } from "react-router-dom";

export const LayoutWrapper = ({ children }: Readonly<TNodeChildrentType>) => {
  const queryClient = new QueryClient();

  return (
    <APPContext.Provider value={{}}>
      <QueryClientProvider
        {...{
          client: queryClient,
        }}
      >
        {children}
      </QueryClientProvider>
    </APPContext.Provider>
  );
};

export const AppLayout = () => {
  return (
    <LayoutWrapper>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </LayoutWrapper>
  );
};

export const ErrorPage = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="font-normal">Something went wrong...</p>
    </div>
  );
};

export const Error404Page = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <p className="font-normal">Page not found</p>

      <button
        className=""
        {...{
          onClick: () => navigate(ROOT_URL_PREFIX),
          variant: "outline",
        }}
      >
        Back to dashboard ?{" "}
      </button>
    </div>
  );
};
