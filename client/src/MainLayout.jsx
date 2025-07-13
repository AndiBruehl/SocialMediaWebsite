import Navbar from "../src/components/Navbar/Navbar.jsx";
import Sidebar from "../src/components/Sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Outlet />
    </>
  );
};

export default MainLayout;
