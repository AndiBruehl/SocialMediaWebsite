import { Link } from "react-router-dom";
import "./menu.css";

import { BiHomeAlt } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { CiViewTimeline } from "react-icons/ci";

const Menu = ({ isOpen }) => {
  return (
    <div className={`menu ${isOpen ? "visible" : "hidden"}`}>
      <Link to="/">
        <span className="menu-link">
          <span>HOME</span>
          <BiHomeAlt />
        </span>
      </Link>
      <Link to="/profile">
        <span className="menu-link">
          <span>PROFILE </span>
          <CgProfile />
        </span>
      </Link>
      <Link to="/">
        <span className="menu-link">
          <span>TIMELINE</span>
          <CiViewTimeline />
        </span>{" "}
      </Link>
    </div>
  );
};

export default Menu;
