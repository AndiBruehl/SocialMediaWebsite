// src/components/Sidebar/Sidebar.jsx
import Links from "./Links";
import FriendsList from "./Friends";
import "./SidebarHover.css";

import { Friends } from "../../data/dummyData";

export default function Sidebar() {
  return (
    <aside className="sidebar-wrapper">
      <div className="sidebar-content">
        <Links />
        <br />
        {Friends.map((friend) => (
          <FriendsList key={friend.id} friend={friend} />
        ))}
        <div className="h-8" />
      </div>
    </aside>
  );
}
