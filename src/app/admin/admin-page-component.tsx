"use client"

import { redirect } from "next/navigation";
import { generateGame } from "./actions";

// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

export function AdminPageComponent() {
    // const [socket, setSocket] = useState<any>(undefined);
    // const [messages, setMessages] = useState<string[]>([]);
    // const [users, setUsers] = useState<string[]>([]);

  
    // useEffect(() => {
    //     console.log("Connecting to socket");
    //     const socket = io("localhost:3000");
    //     socket.on("join", (message) => {
    //         setUsers((users) => [...users, message]);
    //     })
    //     setSocket(socket);
    //     // return () => {
    //     //   socket.close();
    //     // };
    // }, []);

    // const startGame = () => {
    //     socket.emit("start", "Starting game");
    // }

    return (
        <div className="flex flex-col gap-y-5 justify-start">
            <h1 className="font-bold text-[#FFDE03] text-5xl">Welcome Josh</h1>
            <form action={async (formData: FormData) => {
                const time = formData.get("time") as string;
                if (!time) {
                    return;
                }
                const { gameId } = await generateGame(parseInt(time));
                redirect(`/admin/game/${gameId}`);
            }} className="flex gap-5">
                <input type="number" name="time" placeholder="Time" className="bg-[#1E293B] text-white text-3xl px-6 py-2 rounded-md" required/>
                <button type="submit" className="bg-[#03DAC6] text-black px-6 py-2 text-3xl font-bold rounded-md hover:bg-[#53f6e5] transition-all duration-150 ease-in-out">
                    Generate Game
                </button>
            </form>
            {/* {users.map((user, index) => (
                <p key={index}>{user}</p>
            ))} */}
        </div>
    );
}