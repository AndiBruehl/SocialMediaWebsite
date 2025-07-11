import React from "react";
import Links from "./Links"; // <-- relativer Pfad anpassen, falls nötig
import Friends from "./Friends";

const Sidebar = () => {
  return (
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 10px;
          }

          .custom-scrollbar::-webkit-track {
            background-color: lightgrey;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #4b5563; /* z. B. dunkles Grau für den Daumen */
            border-radius: 10px; /* abgerundete Ecken */
            border: 2px solid lightgrey; /* optional: Abstand zum Track */
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #6b7280; /* optional: Farbe bei Hover */
          }
        `}
      </style>
      <div
        style={{
          flex: 2,
          height: "calc(100vh - 80px)",
          msOverflowStyle: "none",
        }}
        className="custom-scrollbar overflow-y-auto"
      >
        <div className="bg-slate-400 p-5 rounded-[15px]">
          <Links />
        </div>
        <br />
        <div className="bg-slate-400 p-5 rounded-[15px]">
          <Friends />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
