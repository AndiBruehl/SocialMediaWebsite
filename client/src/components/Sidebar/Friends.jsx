// client/src/components/RightPanel/FriendsList.jsx
import { NavLink } from "react-router-dom";
import defaultAvatar from "../../assets/avatar.webp";

const API_BASE = "https://socialmediawebsite-92x4.onrender.com";
const isAbs = (s) => /^https?:\/\//i.test(s || "");
const url = (s) => (isAbs(s) ? s : s ? `${API_BASE}${s}` : "");

const FriendsList = ({ user }) => {
  // Expect a full user object (a followed account)
  const profileId = user?._id || user?.id || user?.username || "";
  const avatar = url(user?.profilePicture) || defaultAvatar;
  const label = user?.username || "Unbekannt";

  if (!profileId) return null;

  return (
    <li className="flex items-center mb-2.5">
      <NavLink
        to={`/profile/${profileId}`}
        className={({ isActive }) =>
          `flex items-center gap-4 px-3 py-2 rounded-md transition-all duration-200 ${
            isActive
              ? "bg-slate-200 dark:bg-slate-700 font-semibold text-gray-900 dark:text-white"
              : "hover:bg-slate-100 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300"
          }`
        }
        title={label}
      >
        <div className="relative">
          <img
            src={avatar}
            alt={label}
            className="w-[40px] h-[40px] rounded-full object-cover border border-gray-300 dark:border-gray-600"
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
          />
          {/* Replaced CSS class with inline Tailwind for better dark mode support */}
          {user.online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
          )}
        </div>
        <span className="text-sm truncate">{label}</span>
      </NavLink>
    </li>
  );
};

export default FriendsList;
