import { io } from "socket.io-client";

interface ClubDeletedData {
  message: string;
  redirectTo: string;
}

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
  withCredentials: true,
});

export const connectSocket = (callback: () => void) => {
  socket.on("connect", () => {
    console.log("Подключено к WebSocket серверу");
    if (callback) callback();
  });

  socket.on("connect_error", (error) => {
    console.error("Ошибка подключения к WebSocket:", error);
  });

  return () => {
    socket.off("connect");
    socket.off("connect_error");
  };
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const sendMessage = (message: () => void) => {
  socket.emit("message", message);
};

export const onUserConnected = (callback: () => void) => {
  socket.on("user-connected", callback);
  return () => socket.off("user-connected");
};

export const onUserDisconnected = (callback: () => void) => {
  socket.on("user-disconnected", callback);
  return () => socket.off("user-disconnected");
};

export const onAllUsers = (callback: () => void) => {
  socket.on("all-users", callback);
  return () => socket.off("all-users");
};

export const onMessageUpdate = (callback: () => void) => {
  socket.on("message-update", callback);
  return () => socket.off("cursor-update");
};

export const onClubDeleted = (callback: (data: ClubDeletedData) => void) => {
  socket.on("club-deleted", callback);
  return () => socket.off("club-deleted");
};

export default socket;
