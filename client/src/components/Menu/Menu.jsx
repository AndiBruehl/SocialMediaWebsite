import { BiHomeAlt } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { CiViewTimeline } from "react-icons/ci";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Menu = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("user"));
      const storedUser = parsed?.user;
      if (storedUser && storedUser._id) {
        setUserId(storedUser._id);
        console.log("User ID from localStorage:", storedUser._id);
      } else {
        console.warn("User ID not found in localStorage.");
      }
    } catch (err) {
      console.warn("Could not parse user from localStorage:", err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/signin");
  };

  return (
    <div className="fixed top-[0px] right-[1vw] w-[225px] bg-white dark:bg-gray-800 rounded-[8px] shadow-lg transform transition-transform duration-500 ease-in-out z-[999] p-5 flex flex-col gap-y-4 text-right">
      <Link
        to="/"
        className="flex items-center justify-end gap-3 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <span className="text-base font-medium">Home</span>
        <BiHomeAlt className="text-xl" />
      </Link>

      {userId && (
        <>
          <Link
            to={`/profile/${userId}`}
            className="flex items-center justify-end gap-3 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span className="text-base font-medium">My Profile</span>
            <CgProfile className="text-xl" />
          </Link>

          <Link
            to={`/profile/${userId}/edit`}
            className="flex items-center justify-end gap-3 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span className="text-base font-medium">Edit Profile</span>
            <FiSettings className="text-xl" />
          </Link>
        </>
      )}

      <button
        onClick={handleLogout}
        className="flex items-center justify-end gap-3 text-gray-900 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-400 transition-colors"
      >
        <span className="text-base font-medium">Logout</span>
        <FiLogOut className="text-xl" />
      </button>
    </div>
  );
};

export default Menu;
