import React, { useContext, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import logo from "../../../public/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightToBracket, FaQuestion } from "react-icons/fa6";
import AuthLayout from "../../layout/AuthLayout";
import { AuthContext } from "../../context/AuthContext";
import { loginAuth } from "../../utils/api/auth.api";

const SignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  const [auth, setAuth] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };

    if (!auth.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(auth.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!auth.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      loginAuth({ email: auth.email, password: auth.password }, dispatch);
    }
  };

  // ✅ Weiterleitung nach erfolgreichem Login
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  // Save token and user when login is successful
  useEffect(() => {
    if (user && user.token) {
      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthLayout>
      <motion.div
        className="flex flex-col justify-center items-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.img
          src={logo}
          alt="logo"
          className="w-[200px] mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        <motion.h1 className="text-3xl font-semibold mb-6">Sign In</motion.h1>

        <form className="w-full max-w-sm" onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={auth.email}
              onChange={(e) => setAuth({ ...auth, email: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={auth.password}
              onChange={(e) => setAuth({ ...auth, password: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isFetching}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isFetching ? "Signing in..." : "Sign In"}
          </button>

          {error && (
            <p className="text-red-600 text-sm mt-3">
              Login failed. Try again.
            </p>
          )}
        </form>

        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default SignIn;
