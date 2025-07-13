import React from "react";
import logo from "../../../public/logo.png";
import { Link } from "react-router-dom";
import { FaArrowRightToBracket } from "react-icons/fa6";

const SignUp = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <img src={logo} alt="logo" className="w-[200px]" />
      <h1 className="text-5xl italic font-light font-serif tracking-wider mb-6">
        VelvetVibe Social
      </h1>{" "}
      <div className="w-[97%] mb-20 shadow-lg rounded-md bg-slate-50">
        <div className="p-[10px]  m-5% ">
          <div className="flex flex-col  m-5% items-center justify-between  m-5% ">
            <div className="text-center">
              <h1>Welcome back!</h1>
              <br />
              <span>Great to see you again!</span>
            </div>
            <br />
            <div className="item-center flex flex-col">
              <input type="name" className="name" placeholder="Username" />
              <input type="email" className="email" placeholder="E-Mail" />
              <input
                type="password"
                className="password"
                placeholder="Password"
              />
            </div>
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
              <span className="text-base font-medium ">
                Not registered yet?
              </span>
              <FaArrowRightToBracket className="text-xl" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
