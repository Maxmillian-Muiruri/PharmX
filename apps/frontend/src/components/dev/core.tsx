import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { TNodeChildrentType } from "../../types";
import { APPContext } from "../../context";
import { ROOT_URL_PREFIX } from "../../utils";
import { Outlet, useNavigate } from "react-router-dom";
import RootLayout from "../../app/layout";
import { ScrollProgressBar } from "../ScrollProgressBar";
import { AnnouncementBar } from "../AnnouncementBar";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { ChatBubble } from "../ChatBubble";
import { BackToTop } from "../BackToTop";

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

export const AppLayout = () => {
  return (
    <RootLayout
      {...{
        children: (
          <>
            <ScrollProgressBar />
            <AnnouncementBar />
            <div className="min-h-screen bg-slate-50 flex flex-col w-full">
              <Header />

              <main className="w-full flex-1 p-4">
                <Outlet />
              </main>

              <Footer />
            </div>

            <ChatBubble />
            <BackToTop />
          </>
        ),
      }}
    />
  );
};
