import { Outlet } from "react-router-dom";

export const Auth = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Outlet />
    </div>
  );
};
