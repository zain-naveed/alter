import { SocketURL, WebSocketURL } from "shared/utils/endpoints";
import * as io from "socket.io-client";
let socket = io.connect(SocketURL, { transports: ["websocket"] });
let streamSocket = io.connect(WebSocketURL, { transports: ["websocket"] });
const initSocket = () => {
  socket = socket.on("connect", () => {
    console.log("Socket Connected");
  });
  streamSocket = streamSocket.on("connect", () => {
    console.log("Stream Socket Connected");
  });
};
export { socket, initSocket, streamSocket };
