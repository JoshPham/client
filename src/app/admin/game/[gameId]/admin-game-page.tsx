"use client"

import { Game } from "@/lib/schema/gameSchema";
import { useEffect, useState } from "react";
import * as motion from "motion/react-client"
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { kickPlayer, setGameStarted } from "./actions";

const possiblePeople = [
    {
        name: "Josh Pham",
        deviceId: "123",
        score: 0,
    }, 
    {
        name: "Aditya Kruthiventi",
        deviceId: "123",
        score: 0,
    }, 
    {
        name: "Dulguun Goosh",
        deviceId: "123",
        score: 0,
    }, 
    {
        name: "Dhruv Jadhav",
        deviceId: "123",
        score: 0,
    },
    {
        name: "Syed Rizvi",
        deviceId: "123",
        score: 0,
    }
]

function compare( a: PersonProps, b: PersonProps) {
    if ( a.score! < b.score! ){
      return 1;
    }
    if ( a.score! > b.score! ){
      return -1;
    }
    return 0;
  }
  

interface PersonProps {
    name: string | null;
    deviceId: string | null;
    score: number | null;
}

export function AdminClient({
    game,
    initialPeople
} : {
    game: Game | undefined;
    initialPeople: PersonProps[];
}) {
    const [people, setPeople] = useState<PersonProps[]>(initialPeople);
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const [showGame, setShowGame] = useState<boolean>(false);
    const [isFading, setIsFading] = useState<boolean>(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [time, setTime] = useState<number>(game! .time!);


    useEffect(() => {
        const socket = io("localhost:3000");
        console.log("Connecting to socket");
        socket.on("join", (name: string, deviceId: string) => {
            console.log("JOINED", name)
            setPeople((people) => {
                const newArray = [...people, {
                    name: name,
                    deviceId: deviceId,
                    score: 0,
                }];
                console.log("PEOPLE", newArray);
                // console.table(newArray);
                return newArray;
            });
        })

        socket.on("timer", (gameId: string, time: number) => {
            // console.log("TIMER", time);
            if (gameId === game!.id) {
                setTime(time);
                if (time === 0) {
                    socket.emit("stop");
                }
            }
        })

        socket.on("addPoints", (deviceId: string, currScore: number, itemPrice: number, itemName: string, name: string) => {
            setMessages((messages) => [...messages, `${name} got ${itemName} for $${itemPrice}`]);
            setPeople((people) => {
                if (!people) {
                    return [];
                }
                const newArray = people.map((person) => {
                    if (person.deviceId === deviceId) {
                        return {
                            ...person,
                            score: currScore + itemPrice,
                        }
                    }
                    return person;
                });
                return newArray;
            });
        })
        
        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, [game]);

    const addPerson = () => {
        setPeople((people) => {
            if (!people) {
                return [possiblePeople[0]];
            }
            const newArray = [...people, possiblePeople[Math.floor(Math.random() * possiblePeople.length)]];
            console.table(newArray);
            return newArray;
        });;
    }

    const startGame = () => {
        socket!.emit("start", game!.id, game!.time!);
        setIsFading(true);
        setTimeout(() => {
            setShowGame(true);
            setIsFading(false);
        }, 1000);
    }
    
    if (!game) {
        return <div>Loading...</div>
    }

    if (showGame || game.started) {
        return (
            <div className={`flex flex-col p-10 gap-y-4 justify-start ${isFading ? "motion-opacity-out-[0%]" : "motion-opacity-in-[0%]"} motion-duration-300`}>
                <div className="flex flex-col gap-7">
                    <div className="px-32 text-5xl flex justify-between">
                        <h1 className="text-[#FFDE03] font-bold motion-translate-x-in-[-25%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-blur-in-[10px]">
                            Scoreboard
                        </h1>
                        <h1 className="motion-translate-x-in-[25%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-blur-in-[10px]">
                            Time Left: {time}
                        </h1>
                    </div>
                    <div className="grid grid-cols-3 px-20 w-full max-h-[75vh] p-4 gap-10">
                        <div className="col-span-1 flex gap-4">
                            <motion.aside className="flex flex-col gap-4"
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2, delay: 0.4 }}
                            >
                                <div className="h-16 w-16 bg-[#ffc824] rounded-md" />
                                <div className="h-16 w-16 bg-[#B1B1B1] rounded-md" />
                                <div className="h-16 w-16 bg-[#5A3D08] rounded-md" />
                            </motion.aside>
                            <div className="flex flex-col gap-4 w-full h-[75vh] overflow-y-auto">
                                <motion.div className="flex flex-col gap-4 w-full" 
                                    layout
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, staggerChildren: 100, delayChildren: 500 }}
                                >
                                    {people.sort(compare).map((person, index) => (
                                        <motion.div 
                                            key={person.deviceId}
                                            className="w-full h-16 flex gap-5 justify-between px-5 overflow-x-auto items-center bg-[#1E293B] rounded-md"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            layout
                                            // transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            {/* <span className="flex gap-5"> */}
                                                <p className="text-white text-3xl whitespace-nowrap overflow-x-auto">{person.name!.substring(0,10)}{person.name!.length! > 10 && "."}</p>
                                                <p className="text-white text-3xl border-white">${person!.score}</p>
                                            {/* </span> */}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                        <div className="col-span-2 h-[75vh] flex flex-col gap-5 motion-translate-x-in-[-25%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-blur-in-[10px] motion-delay-700 motion-duration-500">
                            <h2 className="text-4xl">
                                Updates
                            </h2>
                            <div className="flex flex-col gap-2 w-full h-full overflow-y-auto bg-[#1E293B] rounded-md p-4 justify-end">
                                {messages.map((message, index) => (
                                    <div key={index} className="text-white text-3xl p-4 rounded-md motion-translate-x-in-[-10%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-blur-in-[10px] motion-duration-500">
                                        {message}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }



    return (
        <div className={`flex flex-col px-32 py-10 gap-y-4 justify-start ${isFading ? "motion-opacity-out-[0%]" : "motion-opacity-in-[100%]"} motion-duration-300`}>
            <div className="flex flex-col gap-7">
                <h1 className="text-[#FFDE03] text-5xl font-bold motion-translate-x-in-[-25%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-blur-in-[10px]">Game Code</h1>
                <div className="flex w-full justify-between">
                    <p className="bg-[#1E293B] text-white text-8xl font-bold px-28 pb-5 
                                rounded-md flex items-center motion-translate-x-in-[-25%] 
                                motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-blur-in-[10px] 
                                motion-delay-500 shadow-[0px_0px_20px_rgba(0,0,0,0.25)]"> 
                        {game.code}
                    </p>
                    <span className="h-full flex flex-col gap-5 justify-between font-bold">
                        <form action={async () => {
                            startGame();
                            await setGameStarted(game.id);
                        }}>
                            <button className="text-black text-4xl px-20 py-3 rounded-md 
                                            bg-[#03DAC6] hover:bg-[#41ffec] transition-all 
                                            ease-in-out motion-translate-x-in-[25%] 
                                            motion-translate-y-in-[0%] motion-opacity-in-[0%] 
                                            motion-blur-in-[10px] motion-delay-700 motion-duration-500
                                            shadow-[0px_0px_20px_rgba(0,0,0,0.25)]"
                            >
                                Start Game
                            </button>
                        </form>
                        <button className="text-4xl py-3 rounded-md bg-[#FF0266] hover:bg-[#f84b91]
                                         transition-all ease-in-out motion-translate-x-in-[25%] 
                                        motion-translate-y-in-[0%] motion-opacity-in-[0%] 
                                        motion-blur-in-[10px] motion-delay-1000 motion-duration-500
                                        shadow-[0px_0px_20px_rgba(0,0,0,0.25)]"
                            onClick={addPerson}
                        >
                            Stop Game
                        </button>
                    </span>
                </div>
                <div className="p-16 overflow-y-auto bg-[#121924] rounded-md 
                                motion-translate-y-in-[25%] motion-opacity-in-[0%] 
                                motion-blur-in-[10px] motion-delay-[1200ms] 
                                motion-duration-500 shadow-[0px_0px_20px_rgba(0,0,0,0.25)]
                                min-w-full h-[55vh]">
                    <div className="flex gap-6 flex-wrap justify-center w-full">
                        {people && ( 
                            <>
                                {people.toReversed().map((person, index) => (
                                    <motion.form 
                                        key={index} 
                                        className="bg-[#1E293B] text-white text-3xl rounded-md flex items-center justify-between shadow-[0px_0px_20px_rgba(0,0,0,0.25)]
                                                    hover:bg-red-700 transition-all duration-150 ease-in-out"
                                        layout
                                        transition={spring}
                                        // style={{ ...item, backgroundColor }}
                                        action={async () => {
                                            if (person.deviceId !== "123") {
                                                await kickPlayer(game.id, person.deviceId!);
                                            }
                                            setPeople((people) => {
                                                if (!people) {
                                                    return [];
                                                }
                                                const newArray = people.splice(0, index).concat(people.splice(index + 1));
                                                return newArray;
                                            })
                                        }}
                                    >
                                        <button type="submit" className="w-full h-full p-5">{person.name!.substring(0, 20)}</button>
                                    </motion.form>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


const spring = {
    type: "spring",
    damping: 50,
    mass: 3,
    stiffness: 200,
}