import { io } from "socket.io-client";

export function createSocket(token = null) {
  return io("http://localhost:5000", {
    auth: token ? { token } : {},
  });
}
