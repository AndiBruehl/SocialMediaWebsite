import React, { useEffect } from "react";
import { motion } from "framer-motion";
import logo from "../../../public/logo.png";
import { Link } from "react-router-dom";
import { FaArrowRightToBracket, FaQuestion } from "react-icons/fa6";
import AuthLayout from "../../layout/AuthLayout";

const SignIn = () => {
  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  return (
    <AuthLayout>
      <motion.div
        className="flex flex-col justify-center items-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.img
          src={logo}
          alt="logo"
          className="w-[200px] mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        {/* Titel */}
        <motion.h1
          className="text-5xl italic font-light font-serif tracking-wider mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          VelvetVibe Social
        </motion.h1>

        {/* Formular-Box */}
        <motion.div
          className="w-[75%] mb-20 shadow-lg rounded-md bg-slate-50"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className="p-[10px] m-[5%]">
            <div className="flex flex-col items-center justify-between m-[5%]">
              <div className="text-center">
                <h1 className="font-extrabold text-2xl">Welcome back!</h1>
                <br />
                <span>Great to see you again!</span>
              </div>
              <br />
              <div className="flex flex-col gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Username"
                  className="border px-3 py-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border px-3 py-2 rounded"
                />
              </div>
              <br />
              <Link
                to="/signup"
                className="flex items-center justify-end gap-3 text-gray-800 hover:text-blue-600 transition-colors"
              >
                <span className="text-sm">Reset Password</span>
                <FaQuestion className="text-xl" />
              </Link>
              <br />
              <div>
                <button className="cursor-pointer bg-blue-500 font-bold text-white px-4 py-2 rounded hover:bg-blue-600">
                  Join!
                </button>
              </div>
              <br />
              <Link
                to="/signup"
                className="flex items-center justify-end gap-3 text-gray-800 hover:text-blue-600 transition-colors"
              >
                <span className="text-sm">Not registered yet?</span>
                <FaArrowRightToBracket className="text-xl" />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
};

console.log();

export default SignIn;
