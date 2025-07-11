// Links.jsx
import React from "react";
import { NavLink } from "react-router-dom";

import {
  MdBookmark,
  MdGolfCourse,
  MdEmojiEvents,
  MdGroup,
  MdMessage,
  MdOutlineDynamicFeed,
  MdQuestionMark,
  MdVideoLibrary,
} from "react-icons/md";
import { IoMdArrowRoundForward, IoMdBriefcase } from "react-icons/io";

const navItems = [
  { icon: <MdOutlineDynamicFeed />, label: "Feed", to: "/feed" },
  { icon: <MdVideoLibrary />, label: "Videos", to: "/videos" },
  { icon: <MdGroup />, label: "Groups", to: "/groups" },
  { icon: <MdMessage />, label: "Chats", to: "/chats" },
  { icon: <MdBookmark />, label: "Bookmarks", to: "/bookmarks" },
  { icon: <MdQuestionMark />, label: "Questions", to: "/questions" },
  { icon: <IoMdBriefcase />, label: "Jobs", to: "/jobs" },
  { icon: <MdGolfCourse />, label: "Courses", to: "/courses" },
  { icon: <MdEmojiEvents />, label: "Events", to: "/events" },
  { icon: <IoMdArrowRoundForward />, label: "See more", to: "/events" },
];

const Links = () => {
  return (
    <ul className="flex flex-col gap-4 text-white">
      {navItems.map((item, index) => (
        <li key={index}>
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                isActive ? "bg-slate-600 font-semibold" : "hover:bg-slate-500"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default Links;
