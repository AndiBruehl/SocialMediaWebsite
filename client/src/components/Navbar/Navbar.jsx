import { useEffect, useRef, useState } from "react";
import { BiMenu, BiSearchAlt, BiX } from "react-icons/bi";
import Logo from "../Logo/Logo.jsx";
import Menu from "../Menu/Menu";
import SearchBar from "../SearchBar/SearchBar.jsx";
import "./Navbar.css";

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

        <div className="navbar-center">
          <SearchBar
            onSearch={(value) => console.log("Search triggered:", value)}
          />
        </div>

        <div className="navbar-right">
          {isOpen ? (
            <BiX className="menu-icon" onClick={() => setIsOpen(false)} />
          ) : (
            <BiMenu className="menu-icon" onClick={() => setIsOpen(true)} />
          )}
        </div>
      </div>

      <div
        className={`menu-container ${isOpen ? "open" : ""}`}
        onMouseEnter={() => setIsHoveringMenu(true)}
        onMouseLeave={() => setIsHoveringMenu(false)}
      >
        <Menu />
      </div>
    </>
  );
};

export default Navbar;
