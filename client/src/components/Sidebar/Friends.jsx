import React from "react";
import { NavLink } from "react-router-dom";
import pic1 from "../../assets/pic1.png"; // <-- Bild korrekt importieren

const navItems = [{ label: "Violett Smith", to: "/username", img: pic1 }];

const Friends = () => {
  return (
    <ul className="flex flex-col gap-4 text-white">
      {navItems.map((item, index) => (
        <li key={index}>
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                isActive ? "bg-slate-600 font-semibold" : "hover:bg-slate-500"
              }`
            }
          >
            <img
              src={item.img}
              alt={item.label}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span>{item.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default Friends;
