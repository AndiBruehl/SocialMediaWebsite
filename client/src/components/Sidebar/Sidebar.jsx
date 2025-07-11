// src/components/Sidebar/Sidebar.jsx
import Links from "./Links";
import Friends from "./Friends";
import "./SidebarHover.css";

export default function Sidebar() {
  return (
    <aside className="sidebar-wrapper">
      <div className="sidebar-content">
        <Links />
        <Friends />
      </div>
    </aside>
  );
}
