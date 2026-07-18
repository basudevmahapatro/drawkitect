// src/layouts/RegisterLayout.jsx
import { Outlet } from "react-router-dom";
import RegisterProvider from "@/store/RegisterProvider";

const RegisterLayout = () => {
  return (
    <RegisterProvider>
      <Outlet />
    </RegisterProvider>
  );
};

export default RegisterLayout;