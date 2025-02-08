import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let timeouts = [];

app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer, {
        cors: {
            origin: dev ? "http://localhost:3000" : "https://materialism-and-happiness.org",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
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

        socket.on("message", (message) => {
            io.emit("message", message)
        })
    
        socket.on("stop", (gameId) => {
            console.log("Game has stopped");
            timeouts.forEach(clearTimeout);
            timeouts = [];
            io.emit("serverstop", gameId);
        });
    
        socket.on("join", (name, deviceId) => {
            console.log("Emitting JOINED", name)
            console.log("Josh Joined")
            io.emit("join", name, deviceId);
        })
    
        socket.on("addPoints", (deviceId, currScore, points, itemName, name) => {
            io.emit("addPoints", deviceId, currScore, points, itemName, name);
        })
    
        socket.on("endGame", () => {
            io.emit("endGame");
        })
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});