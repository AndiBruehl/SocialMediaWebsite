import React, { useEffect, useState } from "react";
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

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.username) {
      newErrors.username = "Username is required.";
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return (
      !newErrors.username &&
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword
    );
  };

  const handleSignUp = (e) => {
    e.preventDefault(); // Verhindert das Standard-Submit-Verhalten

    if (validateForm()) {
      console.log(formData); // Hier könntest du später API-Requests machen
    }
  };

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
                <form onSubmit={handleSignUp}>
                  {/* Alle Eingabefelder */}
                  <div className="flex flex-col gap-3 w-full">
                    <input
                      type="text"
                      placeholder="Username"
                      className={`border px-3 py-2 rounded ${
                        errors.username ? "border-red-500" : ""
                      }`}
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm">{errors.username}</p>
                    )}

                    <input
                      type="email"
                      placeholder="E-Mail"
                      className={`border px-3 py-2 rounded ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}

                    <input
                      type="password"
                      placeholder="Password"
                      className={`border px-3 py-2 rounded ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}

                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className={`border px-3 py-2 rounded ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Button */}
                  <div className="flex justify-end mt-5 mb-5">
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
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
