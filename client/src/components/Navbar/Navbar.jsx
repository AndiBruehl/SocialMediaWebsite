import { useEffect, useState } from "react";
import { BiMenu, BiSearchAlt, BiX } from "react-icons/bi";
import Logo from "../Logo/Logo.jsx";
import Menu from "../Menu/Menu.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-close after 5 seconds
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => setIsOpen(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <>
      <div className="navbar">
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

      <div className={`menu-container ${isOpen ? "open" : ""}`}>
        <Menu />
      </div>
    </>
  );
};

export default Navbar;
