"use client"

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { signInAction } from "./actions";
import { LoginSchema } from "@/lib/schema/formSchemas";
import { FormSuccess } from "@/components/form-success";
import { redirect } from "next/navigation";
import { hasSwearWords } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const [socket, setSocket] = useState<any>(undefined);
  const [started, setStarted] = useState<boolean>(false);
  // const [name, setName] = useState<string>("");
  // const [isBad, setIsBad] = useState<boolean>(false);

  
  useEffect(() => {
    console.log("Connecting to socket");
    const socket = io("localhost:3000");
    socket.on("start", (started) => {
      setStarted(started);
    })
    setSocket(socket);
    
    // return () => {
      //   socket.close();
      // };
    }, []);
    
    const form = useForm<z.infer<typeof LoginSchema>>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
          password: "",
      }
  });


  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const response = await signInAction(values);
    if (response) {
      setSuccessMessage("Successfully logged in");
      redirect("/admin");
    }
  }
  
  return (
    <>
      <main className="flex flex-col items-start justify-around h-screen ps-32 pe-16 pt-14 pb-5">
        <div className="text-[calc(7vw-max(.5vw,.5rem))] font-[1000] flex flex-col">
          <span className="">
            <h1 className="bg-[#FF0266] text-[#6200EE] motion-preset-typewriter-[11] motion-duration-[4s] ">Materialism</h1>
            <h1 className="bg-[#F57F17] text-[#0039B3] motion-preset-typewriter-[3] motion-duration-[4s]">and</h1>
            <h1 className="bg-[#6200EE] text-[#FFDE03] motion-preset-typewriter-[11] motion-duration-[4s]">"Happiness"</h1>
          </span>
          <p className="text-[calc(4vw-max(1vw,1rem))] font-semibold text-[#00C853] w-full p-5 motion-scale-in-[0.5] motion-translate-x-in-[-48%] motion-translate-y-in-[0%] motion-opacity-in-[50%]
          motion-blur-in-[10px] motion-duration-500">
            a web project developed and <br /> programmed by Josh Pham
          </p>
        </div>
        <p className="ps-[calc(53vw-clamp(2rem,4vw,6rem))] w-full text-left flex text-[calc(3.5vw-max(1vw,1rem))] font-semibold text-[#03DAC6]  after:content-['.'] after:animate-loadingDots 
          motion-scale-in-[0.5] motion-translate-x-in-[60%] motion-translate-y-in-[0%] motion-opacity-in-[50%]
          motion-blur-in-[10px] motion-delay-300 motion-duration-500">
          Waiting for the game to start
        </p>
        {/* className="bg-[#03DAC6] font-bold text-white p-2 rounded-md" */}
        <div className="flex gap-5">
          <Dialog>
            <DialogTrigger asChild>
                <Button size="xl">Log in as Josh</Button>
            </DialogTrigger>      
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Password</DialogTitle>
                <DialogDescription>
                  Enter in the right password to log in as Josh
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form 
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                      >
                    <div className="">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                              <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="********"
                                            type="password"
                                            className="text-base bg-transparent px-3 py-1 h-9"
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                    </div>
  
                    <FormSuccess message={successMessage} />
                  <DialogFooter className="sm:justify-start">
                    <Button type="submit" variant="secondary">
                      Login
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Link href="/join">
            <Button variant="secondary" size="xl">
                Join
            </Button>
          </Link>
        </div>
      </main>
    </>
  )
}
