// server/socket/index.js
import { Server } from "socket.io";

let io = null;

// userId -> Set(socketIds)
const presence = new Map();

function emitPresenceList(toSocket = null) {
  const ids = [...presence.keys()];
  if (toSocket) toSocket.emit("presence:list", ids);
  else io.emit("presence:list", ids);
}

export function initSocket(httpServer, clientOrigin = "http://localhost:5173") {
  io = new Server(httpServer, {
    cors: {
      origin: clientOrigin,
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake?.query?.userId
      ? String(socket.handshake.query.userId)
      : null;

    if (userId) {
      // 1) Room für gezielte Pushes
      socket.join(userId);
      socket.data.userId = userId;

      // 2) Präsenz-Tracking
      let set = presence.get(userId);
      if (!set) {
        set = new Set();
        presence.set(userId, set);
      }
      set.add(socket.id);

      // an alle: dieser User ist online
      socket.broadcast.emit("presence:online", userId);

      // initiale Liste an den neuen Client
      emitPresenceList(socket);
    } else {
      // kein userId → nur initiale Liste schicken
      emitPresenceList(socket);
    }

    socket.on("presence:hello", () => emitPresenceList(socket));

    socket.on("disconnect", () => {
      const uid = socket.data.userId;
      if (!uid) return;
      const set = presence.get(uid);
      if (!set) return;
      set.delete(socket.id);
      if (set.size === 0) {
        presence.delete(uid);
        socket.broadcast.emit("presence:offline", uid);
      }
    });
  });

  return io;
}

export function getIO() {
  return io;
}
