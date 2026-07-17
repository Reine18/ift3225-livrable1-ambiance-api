import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="ambiance-page d-flex flex-column">
      <Navbar />

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;