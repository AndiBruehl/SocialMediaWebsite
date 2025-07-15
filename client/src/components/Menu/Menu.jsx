import { BiHomeAlt } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { CiViewTimeline } from "react-icons/ci";
import { Link } from "react-router-dom";

const Menu = () => {
  // Fallback für Testzwecke
  const testUserId = "685edfa69d8de17c6b7a0b07";

  // Versuche User-ID aus localStorage zu holen
  const storedUserId = localStorage.getItem("userId");

  // Nimm storedUserId, wenn vorhanden & gültig, sonst fallback
  const userId =
    storedUserId && storedUserId.length === 24 ? storedUserId : testUserId;

  return (
    <div className="fixed top-[0px] right-[1vw] w-[225px] bg-slate-300 rounded-[8px] shadow-lg transform transition-transform duration-500 ease-in-out z-[999] p-5 flex flex-col gap-y-4 text-right">
      <Link
        to="/"
        className="flex items-center justify-end gap-3 text-gray-800 hover:text-blue-600 transition-colors"
      >
        <span className="text-base font-medium">Home</span>
        <BiHomeAlt className="text-xl" />
      </Link>

      <Link
        to={`/profile/${userId}/edit`}
        className="flex items-center justify-end gap-3 text-gray-800 hover:text-blue-600 transition-colors"
      >
        <span className="text-base font-medium">Edit Profile</span>
        <CgProfile className="text-xl" />
      </Link>

      <Link
        to="/timeline"
        className="flex items-center justify-end gap-3 text-gray-800 hover:text-blue-600 transition-colors"
      >
        <span className="text-base font-medium">Timeline</span>
        <CiViewTimeline className="text-xl" />
      </Link>
    </div>
  );
};

export default Menu;
