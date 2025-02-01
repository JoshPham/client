"use client"

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { getGameByCode } from "@/db-access/game";
import { db } from "@/lib/db";
import { joinSchema } from "@/lib/schema/formSchemas";
import { Game, playerSessionTable } from "@/lib/schema/gameSchema";
import { cn, hasSwearWords } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { z } from "zod";
import { joinGame } from "./actions";

export default function GamePage({
    game
} : {
    game: Game
}) {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [isFading, setIsFading] = useState<boolean>(false);

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
        setTimeout(() => {
            setIsFading(true);

        }, 300);
        setTimeout(() => {
            setShowConfirmation(true);
            window.onbeforeunload = function (e) {
                return "Please click 'Stay on this Page' if you did this unintentionally";
            };
        }, 1000);
    }
    

    return (
        <main className="flex flex-col items-start justify-around h-screen ps-32 pe-16 pt-16">
            {!showConfirmation ? (
                <div className={`flex flex-col items-center justify-center w-full gap-10 ${isFading ? "motion-opacity-out-[0%] motion-duration-300" : "motion-opacity-in-[0%] motion-duration-2000"}`}>
                    <h1 className="text-[calc(4vw-max(.5vw,.5rem))] text-[#FFDE03] font-bold">
                        Enter your name.
                    </h1>
                    {/* <p className="text-[calc(4vw-max(1vw,1rem))] font-[500] text-[#FFDE03]">
                    Please enter your name to join the experience
                    </p> */}
                    <Form {...form}>
                        <form 
                            action={handleJoin}
                            className="space-y-6 w-[50%]"
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
                <div className={`flex flex-col items-center justify-center w-full gap-10 motion-opacity-in-[0%] motion-duration-500  motion-delay-300`}>
                    <h1 className="text-[calc(4vw-max(.5vw,.5rem))] text-[#FFDE03] font-bold">
                        You’re in the games.
                    </h1>
                    <h2 className="text-[calc(3.5vw-max(.5vw,.5rem))] text-[#00C853] font-bold">
                        Please wait as the games begin.
                    </h2>

                </div>
            )}
      </main>
    )
}