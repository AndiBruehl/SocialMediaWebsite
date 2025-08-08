import { Server } from "socket.io";

let ioInstance = null;

export function initSocket(httpServer, clientOrigin) {
  const io = new Server(httpServer, {
    cors: {
      origin: clientOrigin,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query?.userId;
    if (userId) {
      // user joins a unique room for DMs/notifications
      socket.join(`user:${userId}`);
    }

    socket.on("disconnect", () => {});
  });

  ioInstance = io;
}

export function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized yet");
  }
  return ioInstance;
}
