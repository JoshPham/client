"use client"

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { getGameByCode } from "@/db-access/game";
import { codeSchema } from "@/lib/schema/formSchemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form"
import { z } from "zod";

export default function JoinPage() {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [isFading, setIsFading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof codeSchema>>({
        resolver: zodResolver(codeSchema),
        defaultValues: {
            code: "",
        }
    });

    const onSubmit = (values: z.infer<typeof codeSchema>) => {
        startTransition(async () => {
            if (!values.code) {
                setErrorMessage("Please enter a code");
                return;
            }

            // const response = await getGameByCode(values.code);
            const response = await fetch(`/api/game?code=${values.code}`);
            if (!response.ok) {
                setErrorMessage("Invalid code");
                return;
            }
            const game = await response.json();
            console.table(game);
            setTimeout(() => {
                setIsFading(true);
            }, 300);
            setTimeout(() => {
                redirect(`/game/${game.id}`);
            }, 1000);
        });
    }
    
    return (
        <main className="flex flex-col items-start justify-around h-screen ps-32 pe-16 pt-16 motion-opacity-in-[0%] motion-duration-2000">
          <div className={`flex flex-col items-center justify-center w-full gap-10 ${isFading ? "motion-opacity-out-[0%]" : "motion-opacity-in-[100%]"} motion-duration-300`}>
            <h1 className="text-[calc(4vw-max(.5vw,.5rem))] text-[#FFDE03] font-bold">
                Enter the join code to get started.
            </h1>
            {/* <p className="text-[calc(4vw-max(1vw,1rem))] font-[500] text-[#FFDE03]">
              Please enter your name to join the experience
            </p> */}
            <Form {...form}>
                <form 
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6 w-[35%]"
                      >
                    <div className="">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({field}) => (
                              <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter code here"
                                            type="text"
                                            value={field.value || ""}
                                            className="bg-[#1E293B] text-white font-bold text-4xl text-center pt-1 pb-4"
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
                            Continue
                        </button>
                    </span>
                </form>
              </Form>
          </div>
      </main>
    )
}