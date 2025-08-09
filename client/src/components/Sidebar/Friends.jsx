// client/src/components/RightPanel/FriendsList.jsx
import { NavLink } from "react-router-dom";
import defaultAvatar from "../../assets/avatar.webp";

const API_BASE = "http://localhost:9000";
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
            isActive ? "bg-slate-600 font-semibold" : "hover:bg-slate-500"
          }`
        }
        title={label}
      >
        <img
          src={avatar}
          alt={label}
          className={`w-[40px] h-[40px] rounded-full object-cover ${
            user.online ? "online-badge" : ""
          }`}
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
        <span className="text-sm truncate">{label}</span>
      </NavLink>
    </li>
  );
};

export default FriendsList;
