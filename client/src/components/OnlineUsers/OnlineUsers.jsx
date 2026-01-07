import React from "react";

const OnlineUsers = ({ user }) => {
  return (
    <div>
      <ul className="m-0 p-0">
        <li className="flex items-center mb-2.5">
          <div className="mr-2.5 relative">
            <img
              src={user.profilePicture}
              alt="profilePic"
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
            {/* Added border-white to create a "halo" effect for the dot in both modes */}
            <span className="w-[12px] h-[12px] rounded-full bg-green-600 absolute top-[-2px] right-0 border-2 border-white"></span>
          </div>
          <span className="text-sm ml-3 text-gray-900 dark:text-gray-100">
            {user.username}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default OnlineUsers;
