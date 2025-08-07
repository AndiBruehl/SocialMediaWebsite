import React, { useEffect, useState, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import logo from "../../../public/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightToBracket } from "react-icons/fa6";
import AuthLayout from "../../layout/AuthLayout";
import { signupAuth, loginAuth } from "../../utils/api/auth.api";
import { AuthContext } from "../../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

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

  const [serverError, setServerError] = useState("");

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      // Account erstellen
      await signupAuth({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Direkt danach automatisch einloggen
      await loginAuth(
        {
          email: formData.email,
          password: formData.password,
        },
        dispatch
      );

      // Weiterleitung zur Startseite
      navigate("/");
    } catch (err) {
      setServerError(err);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col justify-center items-center w-full">
        <motion.img
          src={logo}
          alt="logo"
          className="w-[200px] mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        <motion.h1 className="text-3xl font-semibold mb-6">Sign Up</motion.h1>

        <form className="w-full max-w-sm" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full px-3 py-2 mb-3 border rounded"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 mb-3 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-3 py-2 mb-3 border rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full px-3 py-2 mb-4 border rounded"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}

          {serverError && (
            <p className="text-red-600 text-sm mb-2">{serverError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
