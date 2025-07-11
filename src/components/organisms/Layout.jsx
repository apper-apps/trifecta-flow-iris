import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Outlet />
    </div>
  );
};

export default Layout;