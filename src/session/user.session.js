import { userSessions } from "./sessions.js";

export const addUser = (user) => {
  userSessions.push(user);
  return user;
};

export const removeUser = async (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    const user = userSessions[index];
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
