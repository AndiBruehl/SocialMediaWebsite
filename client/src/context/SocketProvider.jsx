// client/src/context/SocketProvider.jsx
import { useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { SocketContext } from "./SocketContext";

export default function SocketProvider({ children }) {
  const { currentUser } = useContext(AuthContext) || {};
  const socketRef = useRef(null);

  useEffect(() => {
    const userId = currentUser?._id;
    if (!userId) return;

    const url = import.meta.env.VITE_API_BASE || "http://localhost:9000";
    const s = io(url, {
      transports: ["websocket"],
      query: { userId },
    });

    socketRef.current = s;

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentUser?._id]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}
