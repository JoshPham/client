"use client"

import { Game } from "@/lib/schema/gameSchema";
import { useState } from "react";
import * as motion from "motion/react-client"

const possiblePeople = [
    {
        name: "Josh Pham",
    }, 
    {
        name: "Aditya Kruthiventi",
    }, 
    {
        name: "Dulguun Goosh",
    }, 
    {
        name: "Dhruv Jadhav",
    },
    {
        name: "Syed Rizvi",
    }
]

export function AdminClient({
    game,
} : {
    game: Game | undefined;
}) {
    if (!game) {
        return <div>Loading...</div>
    }

    const [people, setPeople] = useState<{name: string}[] | undefined>(undefined);

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

    return (
        <div className="flex flex-col p-10 gap-y-4 justify-start">
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
                        <button className="text-black text-4xl px-20 py-3 rounded-md 
                                        bg-[#03DAC6] hover:bg-[#41ffec] transition-all 
                                        ease-in-out motion-translate-x-in-[25%] 
                                        motion-translate-y-in-[0%] motion-opacity-in-[0%] 
                                        motion-blur-in-[10px] motion-delay-700 motion-duration-500
                                        shadow-[0px_0px_20px_rgba(0,0,0,0.25)]">
                            Start Game
                        </button>
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
                                    <motion.li 
                                        key={index} 
                                        className="bg-[#1E293B] text-white text-3xl p-5 rounded-md flex items-center justify-between shadow-[0px_0px_20px_rgba(0,0,0,0.25)]"
                                        layout
                                        transition={spring}
                                        // style={{ ...item, backgroundColor }}
                                    >
                                        <span>{person.name.substring(0, 20)}</span>
                                    </motion.li>
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