import React from "react";
import Links from "./Links"; // <-- relativer Pfad anpassen, falls nötig
import Friends from "./Friends";

const Sidebar = () => {
  return (
    <div
      style={{
        flex: 1,
        height: "calc(100vh - 80px)",
      }}
    >
      <div className="bg-slate-400 p-5 rounded-[15px]">
        <Links />
      </div>
      <br />
      <div className="bg-slate-400 p-5 rounded-[15px]">
        <Friends />
      </div>
    </div>
  );
};

export default Sidebar;
