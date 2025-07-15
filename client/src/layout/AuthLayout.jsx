import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="w-full  flex items-center justify-center bg-inherit text-inherit">
      <div className="mt-8 w-full h-[75vh] max-w-md p-6 border-white border-8 shadow-md rounded-lg">
        {" "}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
