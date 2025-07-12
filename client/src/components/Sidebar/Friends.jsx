import { NavLink } from "react-router-dom";

const FriendsList = ({ friend }) => {
  return (
    <div>
      <ul className="m-0 p-0">
        <li className="flex items-center mb-2.5">
          <NavLink
            to={`/profile/${friend.username}`}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2 rounded-md transition-all duration-200 ${
                isActive ? "bg-slate-600 font-semibold" : "hover:bg-slate-500"
              }`
            }
          >
            <img
              src={friend.profilePicture}
              alt="profilePic"
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
            <span className="text-sm">{friend.username}</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default FriendsList;
