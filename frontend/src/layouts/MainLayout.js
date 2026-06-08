import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />

      <main
        style={{
          marginTop: "70px",
          padding: "20px",
          minHeight: "100vh",
          background: "#f8fafc"
        }}
      >
        <Outlet />
      </main>
    </>
  );
}