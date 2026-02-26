import React, { PropsWithChildren } from "react";
import "../globals.css";
const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-white rounded-2xl flex justify-center items-center min-h-screen h-max min-w-screen">
      {children}
    </div>
  );
};
export default AuthLayout;
