import React from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config";

const socket = io(SOCKET_URL, { secure: true });

socket.on("connect", (data) => {
    // define default message when socket is connected
    console.log("socket connected: " + socket.id);
});

const SocketContext = React.createContext();

export { socket, SocketContext };
