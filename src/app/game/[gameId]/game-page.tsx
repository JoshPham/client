"use client"

import { FormError } from "@/components/form-error";
import { FormControl, FormField, FormItem, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { joinSchema } from "@/lib/schema/formSchemas";
import { Game, PlayerSession } from "@/lib/schema/gameSchema";
import { hasSwearWords } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { z } from "zod";
import { motion } from "framer-motion";
import { addPoints, joinGame } from "./actions";
import { socket } from "@/socket";
import Image from "next/image";

import BoxPic from "@/images/box.png";
import { items } from "./items";
import { triviaQuestions } from "./questions";
import Link from "next/link";

interface ItemProps {
    id: string
    name: string
    price: number
    difficulty: string
    image: string
    width: number
    height: number
}

type QuestionProps = typeof triviaQuestions[0];

function shuffle(array: string[]) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

export default function GamePage({
    game,
    playerSession,
    deviceId
} : {
    game: Game,
    playerSession: PlayerSession
    deviceId: string
}) {
    const [isConnected, setIsConnected] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [isFading, setIsFading] = useState<boolean>(false);
    const [isSubFading, setIsSubFading] = useState<boolean>(false);
    const [started, setStarted] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(3);
    const [showGame, setShowGame] = useState<boolean>(false);
    const [showItem, setShowItem] = useState<boolean>(false);
    const [item, setItem] = useState<ItemProps | undefined>();
    const [showQuestion, setShowQuestion] = useState<boolean>(false);
    const [question, setQuestion] = useState<QuestionProps | undefined>(undefined);
    const [showCorrect, setShowCorrect] = useState<boolean>(false);
    const [correct, setCorrect] = useState<boolean>(false);
    const [session, setSession] = useState<PlayerSession | undefined>(playerSession);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [isAnswerDisabled, setIsAnswerDisabled] = useState(false);

    useEffect(() => {
        if (session) {
            setShowConfirmation(true)
        }
    }, [session])

    useEffect(() => {
        if (timer <= 0) {
            setIsFading(true);
            setTimeout(() => {
                setShowGame(true);
                setIsFading(false);
            }, 1000);
        }
    }, [timer]);

    useEffect(() => {
        if ((game.started || started) && showConfirmation && timer > 0) {
            setTimeout(() => {
                if (timer <= 0) {
                    return;
                }
                setTimer((timer) => timer - 1);
            }, 1000);
        }
    }, [game.started, started, showConfirmation, timer]);

    useEffect(() => {
        socket.on("connect", () => {
          console.log("✅ WebSocket Connected");
          setIsConnected(true);
        });

        if (isConnected) {
            console.log("connected")
        }
    
        socket.on("disconnect", () => {
          console.log("❌ WebSocket Disconnected");
          setIsConnected(false);
        });
        socket.on("serverstart", () => {
            console.log("Game has started");
            setIsFading(true);
            setTimeout(() => {
                setStarted(true);
                setIsFading(false);
            }, 1000);
        })

        socket.on("serverstop", () => {
            console.log("Game has stopped");
            setIsFading(true);
            setTimeout(() => {
                setStarted(false);
                setGameOver(true);
                setIsFading(false);
            }, 1000);
        })

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("serverstop")
            socket.off("serverstart")
          };
        
    }, [playerSession, isConnected]);

    const form = useForm<z.infer<typeof joinSchema>>({
        resolver: zodResolver(joinSchema),
        defaultValues: {
            name: "",
        }
    });

    async function handleJoin(formData: FormData) {
        const name = formData.get("name") as string;
        if (!name) {
            setErrorMessage("Please enter your name");
            return;
        }

        const { has_profanity } = await hasSwearWords(name);
        if (has_profanity) {
            setErrorMessage("Name contains profanity. Choose another name.");
            return;
        }


        await joinGame(game.id, name);
        setSession({ name, deviceId, score: 0, id: 0, gameId: null });
        
        setTimeout(() => {
            setIsFading(true);
        }, 300);
        setTimeout(() => {
            setShowConfirmation(true);
            socket!.emit("join", name, deviceId);
            window.onbeforeunload = function () {
                return "Please click 'Stay on this Page' if you did this unintentionally";
            };
            setIsFading(false);
        }, 1000);
    }

    const chooseItem = () => {
        setIsSubFading(true);
    
        setTimeout(() => {
            const randomItem = items[Math.floor(Math.random() * items.length)];
            setItem(randomItem);
            setShowItem(true);
        }, 300);
    
        setTimeout(() => {
            setIsSubFading(false);
        }, 600);
    };

    const rerollItem = () => {
        setShowQuestion(false);
        setCorrect(false);
        setShowCorrect(false);
    
        setIsSubFading(true);
    
        setTimeout(() => {
            setItem(undefined);
            setShowItem(false);
        }, 500);
    
        setTimeout(() => {
            setIsSubFading(false);
        }, 1000);
    };

    const showGameQuestion = (difficulty: string) => {
        setIsSubFading(true);
        const randomQuestionLength = triviaQuestions.filter((question) => question.difficulty === difficulty).length;
        const randomQuestion = triviaQuestions.filter((question) => question.difficulty === difficulty)[Math.floor(Math.random() * randomQuestionLength)];
        shuffle(randomQuestion.answers);
        
        setTimeout(() => {
            setShowQuestion(true);
            setQuestion(randomQuestion);
            setIsSubFading(false);
        }, 1000);
    };

    const chooseAnswer = (question: QuestionProps, answer: string) => {
        if (isAnswerDisabled) return;
        setIsAnswerDisabled(true);

        if (answer === question.correct_answer && session) {
            socket?.emit("addPoints", session!.deviceId!, (session!.score || 0), item!.price, item!.name, session!.name);
            
            setCorrect(true);
            setIsSubFading(true);
            session.score = (session.score || 0) + item!.price;
            setTimeout(() => {
                setShowCorrect(true);
                setIsSubFading(false);
            }, 1000);
        } else {
            setCorrect(false);
            setIsSubFading(true);
            setTimeout(() => {
                setShowCorrect(true);
                setIsSubFading(false);
            }, 1000);
        }

        setTimeout(() => {
            setIsAnswerDisabled(false);
        }, 1000);
    };


    if (gameOver && session) {
        return (
            <div className="flex flex-col items-center justify-center w-full gap-10 h-screen">
                <h1 className="text-5xl text-[#FFDE03] font-bold">
                    Game ended
                </h1>
                <h2 className="text-5xl text-[#03DAC6] font-bold text-center">
                    You have won a whopping{" "}{session.score}{" "}dollars!
                </h2>
                <Link
                    href="/learn-more"
                    className="text-3xl font-bold text-center underline hover:no-underline"
                >
                    Click here to learn more about your experience
                </Link>
            </div>
        )
    }

    if (showGame && session) {
        return (
            <div className={`flex flex-col md:p-10 w-full gap-y-4 justify-start h-[110vh] md:h-screen  ${isFading ? "motion-opacity-out-[0%]" : "motion-opacity-in-[0%]"} motion-duration-300`}>
                <div className="flex flex-col gap-7">
                    <div className="text-3xl md:text-5xl flex justify-between">
                        <h1 className="text-[#FFDE03] flex-col flex md:flex-row md:gap-2 font-bold motion-translate-x-in-[-25%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-blur-in-[10px]">
                            <span>
                                Name: 
                            </span>
                            <span>
                                {session.name}
                            </span>
                        </h1>
                        <h1 className="font-bold flex flex-col md:flex-row text-[#03DAC6] motion-translate-x-in-[25%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-blur-in-[10px]">
                            <span>
                                Net Worth: 
                            </span>
                            <span>
                                ${session.score}
                            </span>
                        </h1>

                    </div>
                    {/* <form action={async (formData: FormData) => {
                        const points = formData.get("points") as string;
                        await addPoints(game.id, playerSession.deviceId!, playerSession.score!, parseInt(points));
                        socket?.emit("addPoints", game.id, playerSession.deviceId, playerSession.score, parseInt(points));
                    }} className="flex gap-5">
                        <input type="number" name="points" placeholder="Points" className="bg-[#1E293B] text-white text-4xl px-4 py-2 rounded-md" required/>
                        <button className="bg-[#03DAC6] text-black px-4 py-2 text-xl font-bold rounded-md hover:bg-[#53f6e5]"
                            
                        >
                            Add Points
                        </button>
                    </form> */}
                        <div className={`flex flex-col gap-16 justify-center items-center ${(showCorrect && correct) || (!item && !showItem) ? "h-[70vh]" : ""} md:h-[80vh] ${isSubFading ? "motion-opacity-out-[0%]" : "motion-opacity-in-[0%]"} motion-duration-300`}>                        {showCorrect ? (
                            <div className="flex flex-col gap-10 justify-center items-center">
                                {correct ? (
                                    <>
                                        <h1 className="text-5xl text-[#00C853] font-bold">
                                            Correct Answer
                                        </h1>
                                        <h2 className="text-5xl text-[#03DAC6] font-bold text-center">
                                            You have earned {" "}
                                            <span className="text-[#FFDE03] font-bold text-5xl">
                                                ${item!.price}
                                            </span>
                                        </h2>
                                    </>
                                ) : (
                                    <>
                                        <h1 className="text-5xl text-[#FF0266] font-bold">
                                            Incorrect Answer
                                        </h1>
                                        <h2 className="text-5xl text-[#FFDE03] font-bold">
                                            Please try again
                                        </h2>
                                    </>
                                )}
                                <button className={`bg-[#03DAC6] text-black  px-20 py-3 text-2xl md:text-4xl font-bold rounded-md hover:bg-[#53f6e5] transition-all duration-150 ease-in-out drop-shadow-[0px_0px_6px_#03DAC6] ${isSubFading ? "motion-opacity-out-[0%]" : "motion-opacity-in-[0%] motion-delay-300"} motion-duration-500`}
                                    onClick={() => {
                                        setIsSubFading(true);
                                    
                                        setTimeout(() => {
                                            setShowQuestion(false);
                                            setShowCorrect(false);
                                            setCorrect(false);
                                        }, 300);
                                    
                                        setTimeout(() => {
                                            rerollItem();
                                        }, 600);
                                    }}
                                >
                                    Continue
                                </button>
                            </div>
                        ) : (
                            <>
                                {(item && showQuestion && question && session) ? (
                                    <div className="grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-5 w-full gap-6 md:gap-0"
                                        style={{
                                            height: item.height / item.width * 200 + 200
                                        }}
                                    >
                                        <div className={`flex w-full md:w-full items-center md:items-start md:pt-10 justify-center`}
                                            // style={{
                                            //     height: item.height / 50
                                            // }}
                                        >
                                            <Image
                                                src={item.image}
                                                width={200}
                                                height={item.height / item.width * 200}
                                                alt={item.name}
                                                className="bg-[#1E293B] rounded-md"
                                            />
                                        </div>
                                        <div className="col-span-4 flex flex-col justify-between md:h-[80vh] pt-10 pb-20 md:ps-20 gap-10 items-start">
                                            <span className="flex flex-col gap-5 justify-between w-full">
                                                <span className="flex justify-between w-full">
                                                    <h1 className="md:text-3xl font-bold text-[#00C853]">
                                                        Item: {item.name}
                                                    </h1>
                                                    <h1 className="md:text-3xl">
                                                        Difficulty:{" "}
                                                        <span 
                                                            style={{ color: item.difficulty === "Easy" ? "#00C853" : item.difficulty === "Medium" ? "#FFDE03" : item.difficulty === "Hard" ? "#FF0266" : "#6200EE" }}
                                                        >{item.difficulty}</span>
                                                    </h1>
                                                </span>
                                                <h1 className="text-3xl text-[#6200EE]">
                                                    Worth: ${item.price}
                                                </h1>
                                            </span>
                                            <h1 className="text-3xl md:text-4xl text-[#FFDE03] font-bold">
                                                Question
                                            </h1>
                                            <h2 className="text-2xl md:text-4xl text-[#03DAC6] font-bold flex-grow select-none" unselectable="on">
                                                {question.question}
                                            </h2>
                                            <div className="flex flex-col gap-10 items-center w-full">
                                                <span className="flex gap-10 w-full">
                                                    <form action={async () => {
                                                        if (question.answers[0] === question.correct_answer) {
                                                            await addPoints(game.id, deviceId, session.score, item.price);
                                                        }
                                                    }}
                                                        className="w-full h-full"
                                                    >
                                                        <button className="md:w-80 w-full h-full bg-[#03DAC6] text-black px-12 md:px-20 py-3 text-2xl md:text-4xl font-bold rounded-md hover:bg-[#53f6e5] transition-all duration-150 ease-in-out drop-shadow-[0px_0px_6px_#03DAC6]"
                                                            onClick={() => {chooseAnswer(question, question.answers[0])}}
                                                            type="submit"
                                                        >
                                                            {question.answers[0]}
                                                        </button>
                                                    </form>
                                                    <form action={async () => {
                                                        if (question.answers[1] === question.correct_answer) {
                                                            await addPoints(game.id, deviceId, session.score, item.price);
                                                        }
                                                    }}
                                                        className="w-full h-full"
                                                    >
                                                        <button className="md:w-80 w-full h-full bg-[#FFDE03] text-black px-12 md:px-20 py-3 text-2xl md:text-4xl font-bold rounded-md hover:bg-[#ffe95b] transition-all duration-150 ease-in-out drop-shadow-[0px_0px_6px_#FFDE03]"
                                                            onClick={() => {chooseAnswer(question, question.answers[1])}}
                                                            type="submit"
                                                        >
                                                            {question.answers[1]}
                                                        </button>
                                                    </form>
                                                </span>
                                                <span className="flex gap-10 w-full">
                                                    <form action={async () => {
                                                        if (question.answers[2] === question.correct_answer) {
                                                            await addPoints(game.id, deviceId, session.score, item.price);
                                                        }
                                                    }}
                                                        className="w-full h-full"
                                                    >
                                                        <button className="md:w-80 w-full h-full bg-[#FF0266] text-black px-12 md:px-20 py-3 text-2xl md:text-4xl font-bold rounded-md hover:bg-[#ff4d8c] transition-all duration-150 ease-in-out drop-shadow-[0px_0px_6px_#FF0266]"
                                                            onClick={() => {chooseAnswer(question, question.answers[2])}}
                                                            type="submit"
                                                        >
                                                            {question.answers[2]}
                                                        </button>
                                                    </form>
                                                    <form action={async () => {
                                                        if (question.answers[3] === question.correct_answer) {
                                                            await addPoints(game.id, deviceId, session.score, item.price);
                                                        }
                                                    }}
                                                        className="w-full h-full"
                                                    >
                                                        <button className="md:w-80 w-full h-full bg-[#6200EE] text-black px-12 md:px-20 py-3 text-2xl md:text-4xl font-bold rounded-md hover:bg-[#7d3dff] transition-all duration-150 ease-in-out drop-shadow-[0px_0px_6px_#6200EE]"
                                                            onClick={() => {chooseAnswer(question, question.answers[3])}}   
                                                            type="submit"
                                                        >
                                                            {question.answers[3]}
                                                        </button>
                                                    </form>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {(item && showItem)? (
                                            <div className="grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-5 w-full gap-6 md:gap-0">
                                                <div className="flex w-full md:w-full items-end md:items-start md:pt-10 justify-center"
                                                    style={{
                                                        height: item.height / item.width * 200 + 200
                                                    }}
                                                >
                                                    <Image
                                                        src={item.image}
                                                        width={300}
                                                        height={item.height / item.width * 300}
                                                        alt={item.name}
                                                        className="bg-[#1E293B] rounded-md"
                                                    />
                                                </div>
                                                <div className="col-span-4 flex flex-col md:h-[80vh] gap-4 md:gap-0 justify-between md:pt-20 px-10 pb-10">
                                                    <span className="flex flex-col gap-5 justify-center items-start">
                                                        <h1 className="text-4xl font-bold text-[#00C853]">
                                                            Item: {item.name}
                                                        </h1>
                                                        <h1 className="text-4xl text-[#6200EE]">
                                                            Worth: ${item.price}
                                                        </h1>
                                                        <h1 className="text-4xl">
                                                            Price:{" "}
                                                            <span 
                                                                style={{ color: item.difficulty === "Easy" ? "#00C853" : item.difficulty === "Medium" ? "#FFDE03" : item.difficulty === "Hard" ? "#FF0266" : "#6200EE" }}
                                                            >{item.difficulty}</span>
                                                        </h1>
                                                    </span>
                                                    <span className="flex flex-col gap-10 justify-center items-start">
                                                        <h1 className="text-3xl md:text-5xl text-[#03A9F4]">
                                                            Play to get item?
                                                        </h1>
                                                        <span className="flex gap-10">
                                                            <button className="bg-[#03DAC6] text-black px-5 py-2 md:px-20 md:py-3 text-2xl md:text-4xl font-bold rounded-md hover:bg-[#53f6e5] transition-all duration-150 ease-in-out drop-shadow-[0px_0px_6px_#03DAC6]"
                                                                onClick={() => {showGameQuestion(item.difficulty)}}
                                                            >
                                                                Continue
                                                            </button>
                                                            <button className="bg-[#FFDE03] text-black px-5 py-2 md:px-20 md:py-3 text-2xl md:text-4xl font-bold rounded-md hover:bg-[#ffe95b] transition-all duration-150 ease-in-out drop-shadow-[0px_0px_6px_#FFDE03]"
                                                                onClick={rerollItem}
                                                            >
                                                                Reroll Item
                                                            </button>
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="font-bold text-4xl w-full md:text-5xl text-[#00C853] text-center">
                                                    Choose one of the boxes
                                                </h2>
                                                <motion.div className="flex justify-between gap-20"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.5, delay: 0.4 }}
                                                >
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        transition={{ duration: 0.1 }}
                                                        className=""
                                                        onClick={chooseItem}
                                                    >
                                                        <Image
                                                            src={BoxPic}
                                                            width={300}
                                                            height={300}
                                                            alt="Box"
                                                            draggable="false"
                                                        />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        transition={{ duration: 0.1 }}
                                                        className=""
                                                        onClick={chooseItem}
                                                    >
                                                        <Image
                                                            src={BoxPic}
                                                            width={300}
                                                            height={300}
                                                            alt="Box"
                                                            draggable="false"
                                                        />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        transition={{ duration: 0.1 }}
                                                        className=""
                                                        onClick={chooseItem}
                                                    >
                                                        <Image
                                                            src={BoxPic}
                                                            width={300}
                                                            height={300}
                                                            alt="Box"
                                                            draggable="false"
                                                        />
                                                    </motion.button>
                                                </motion.div>
                                            </>
                                        )}

                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <main className="flex flex-col w-full items-start justify-around min-h-screen px-0 md:px-16 md:pt-16">
            {!showConfirmation ? (
                <div className={`flex flex-col items-center justify-center w-full gap-10 ${isFading ? "motion-opacity-out-[0%] motion-duration-300" : "motion-opacity-in-[0%] motion-duration-2000"}`}>
                    <h1 className="text-center w-full text-5xl md:text-[calc(4vw-max(.5vw,.5rem))] text-[#FFDE03] font-bold">
                        Enter your name.
                    </h1>
                    <Form {...form}>
                        <form 
                            action={handleJoin}
                            className="space-y-6 md:w-[50%]"
                            >
                            <div className="">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                    <FormItem>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Name goes here"
                                                    type="text"
                                                    value={field.value || ""}
                                                    className="bg-[#1E293B] text-white font-bold text-4xl text-center py-4"
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
        
                            <FormError message={errorMessage} />
                            <span className="w-full flex justify-center">
                                <button className="bg-[#03DAC6] hover:bg-[#3ae7d6] px-20 text-black font-bold py-2 rounded-md text-4xl transition-all duration-150 ease-in-out "
                                        type="submit"
                                >
                                    Join Game
                                </button>
                            </span>
                        </form>
                    </Form>
                    {/* {isBad && <p className="text-red-500">Name contains profanity. Choose another name to join</p>} */}
                </div>
            ) : (
                <>
                    {(game.started || started) ? (
                        <div className={`flex flex-col items-center justify-center w-full gap-10 ${isFading ? "motion-opacity-out-[0%] motion-duration-300" : "motion-opacity-in-[0%] motion-duration-2000"}`}>
                            <h1 className="text-5xl md:text-[calc(3.5vw-max(.2vw,.2rem))] text-[#00C853] font-bold text-center">
                                The games have started.
                            </h1>
                            <h2 className="text-xl md:text-[calc(3vw-max(.1vw,.1rem))] text-[#03DAC6] text-center font-bold">
                                You will proceed in {timer} seconds
                            </h2>
                        </div>
                    ) : (
                        <div className={`flex flex-col items-center justify-center w-full gap-10 ${isFading ? "motion-opacity-out-[0%] motion-duration-300" : "motion-opacity-in-[0%] motion-duration-500  motion-delay-300"}`}>
                            <h1 className="text-center text-5xl md:text-[calc(3.5vw-max(.2vw,.2rem))] text-[#FFDE03] font-bold">
                                You’re in the games.
                            </h1>
                            <h2 className="text-center text-4xl md:text-[calc(3vw-max(.1vw,.1rem))] text-[#00C853] font-bold">
                                {started ? "Game has started" : "Please wait as the games begin. Waiting for the game to start..."}
                            </h2>
                        </div>
                    )}
                </>
            )}   
        </main>
    )
}