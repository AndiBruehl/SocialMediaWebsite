// socket/index.js
import { Server } from "socket.io";

let io;

export function initSocket(httpServer, origin = "*") {
  io = new Server(httpServer, {
    cors: { origin, credentials: true },
  });

  const online = new Map(); // userId -> Set(socketId)

  io.on("connection", (socket) => {
    const { userId } = socket.handshake.query || {};
    if (userId) {
      const set = online.get(userId) || new Set();
      set.add(socket.id);
      online.set(userId, set);

      socket.join(`user:${userId}`);
    }

    socket.on("join:conversation", (conversationId) => {
      if (conversationId) socket.join(`conv:${conversationId}`);
    });

    socket.on("disconnect", () => {
      const { userId } = socket.handshake.query || {};
      if (!userId) return;
      const set = online.get(userId);
      if (!set) return;
      set.delete(socket.id);
      if (set.size === 0) online.delete(userId);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
