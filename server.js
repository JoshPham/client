import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
// import { Socket } from "socket.io-client";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// let timeouts: NodeJS.Timeout[] = [];
let timeouts = [];
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  // io.on("connection", (socket: any) => {
  io.on("connection", (socket) => {
    console.log("connected");

    // socket.on("start", (gameId: string, time: number) => {
    socket.on("start", (gameId, time) => {

        console.log("Game has started");

        timeouts.forEach(clearTimeout);
        timeouts = [];

        io.emit("serverstart", true);

        for (let i = 0; i <= time; i++) {
            const timeoutId = setTimeout(() => {
                io.emit("timer", gameId, time - i);
            }, i * 1000 + 4000);

            timeouts.push(timeoutId);
        }
    });

    socket.on("stop", () => {
        console.log("Game has stopped");
        timeouts.forEach(clearTimeout);
        timeouts = [];
        io.emit("serverstop", true);
    });

    // socket.on("join", (name: string, deviceId: string) => {
    socket.on("join", (name, deviceId) => {
        console.log("Emitting JOINED", name)
        console.log("Josh Joined")
        io.emit("join", name, deviceId);
    })

    // socket.on("addPoints", (deviceId: string, currScore: number, points: number, itemName: string, name: string) => {
    socket.on("addPoints", (deviceId, currScore, points, itemName, name) => {
        io.emit("addPoints", deviceId, currScore, points, itemName, name);
    })

    socket.on("endGame", () => {
        io.emit("endGame");
    })
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});