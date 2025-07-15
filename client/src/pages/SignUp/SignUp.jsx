import React, { useEffect } from "react";
import { motion } from "framer-motion";
import logo from "../../../public/logo.png";
import { Link } from "react-router-dom";
import { FaArrowRightToBracket } from "react-icons/fa6";
import AuthLayout from "../../layout/AuthLayout";

const SignUp = () => {
  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  return (
    <AuthLayout>
      <div className="flex flex-col justify-center items-center w-full">
        {/* 1. Rahmen */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center w-full"
        >
          {/* 2. Logo */}
          <motion.img
            src={logo}
            alt="logo"
            className="w-[200px] mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />

          {/* 3. Titel */}
          <motion.h1
            className="text-5xl italic font-light font-serif tracking-wider mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            VelvetVibe Social
          </motion.h1>

          {/* 4. Formular-Box */}
          <motion.div
            className="w-[75%] max-w-md mb-20 shadow-lg rounded-md bg-slate-50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <div className="p-6">
              <div className="flex flex-col items-center justify-between gap-6">
                {/* Überschrift */}
                <div className="text-center">
                  <h2 className="font-extrabold text-2xl">Sign Up!</h2>
                  <p>
                    Connect with fellow creators, learn something new and enjoy!
                    ❤️
                  </p>
                </div>

                {/* Alle Eingabefelder */}
                <div className="flex flex-col gap-3 w-full">
                  <input
                    type="text"
                    placeholder="Username"
                    className="border px-3 py-2 rounded"
                  />
                  <input
                    type="email"
                    placeholder="E-Mail"
                    className="border px-3 py-2 rounded"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="border px-3 py-2 rounded"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="border px-3 py-2 rounded"
                  />
                </div>

                {/* Button */}
                <div>
                  <button className="cursor-pointer bg-blue-500 font-bold text-white px-4 py-2 rounded hover:bg-blue-600">
                    Join!
                  </button>
                </div>

                {/* Link zu SignIn */}
                <Link
                  to="/signin"
                  className="flex items-center justify-center gap-2 text-gray-800 hover:text-blue-600 text-sm transition-colors"
                >
                  <span>Already registered?</span>
                  <FaArrowRightToBracket className="text-xl" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
