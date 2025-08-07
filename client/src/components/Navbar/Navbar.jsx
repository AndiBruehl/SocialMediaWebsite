import { useEffect, useRef, useState } from "react";
import { BiMenu, BiMessageDetail, BiX, BiBell } from "react-icons/bi";
import Logo from "../Logo/Logo.jsx";
import Menu from "../Menu/Menu";
import SearchBar from "../Searchbar/Searchbar.jsx";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear any previous timer
    clearTimeout(timerRef.current);

    // Only start timer if menu is open and not hovered
    if (isOpen && !isHoveringMenu) {
      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 4000);
    }

    // Cleanup on unmount
    return () => clearTimeout(timerRef.current);
  }, [isOpen, isHoveringMenu]);

  return (
    <>
      <div className="navbar bg-slate-600 text-white shadow-md">
        <div className="navbar-left">
          <Logo />
        </div>

        {/* <div className="navbar-center">
          <SearchBar
            onSearch={(value) => console.log("Search triggered:", value)}
          />
        </div> */}

        <div className="navbar-right gap-2">
          {/* <div className="relative">
            <Link to="/messages">
              <BiMessageDetail className="icon-size" />
              <span className="notification-badge">1</span>
            </Link>
          </div>
          <div className="relative">
            <Link to="/notifications">
              <BiBell className="icon-size" />
              <span className="notification-badge">2</span>
            </Link>
          </div> */}
          {isOpen ? (
            <BiX
              className="menu-icon icon-size"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <BiMenu
              className="menu-icon icon-size"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>
      </div>

      <div
        className={`menu-container ${isOpen ? "open" : ""}`}
        onMouseEnter={() => setIsHoveringMenu(true)}
        onMouseLeave={() => setIsHoveringMenu(false)}
      >
        <Menu isOpen={isOpen} />
      </div>
    </>
  );
};

console.log("navbar loaded");
export default Navbar;
