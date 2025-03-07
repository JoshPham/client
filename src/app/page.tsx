"use client"

import { useState } from "react";

import {
  Dialog,
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
import { useForm } from "react-hook-form";
import { signInAction } from "./actions";
import { LoginSchema } from "@/lib/schema/formSchemas";
import { FormSuccess } from "@/components/form-success";
import { redirect } from "next/navigation";
// import { hasSwearWords } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  // const [name, setName] = useState<string>("");
  // const [isBad, setIsBad] = useState<boolean>(false);

  
    
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
      <main className="flex flex-col items-start justify-around h-screen px-5 md:ps-32 md:pe-16 pb-5 pt-[calc(1vh+1rem)]">
        <div className="font-[1000] flex flex-col gap-5 md:gap-0">
          <span className="text-5xl md:text-[calc(7.5vw-max(10%,1.2rem))] leading-[10vh] md:leading-[15vh] md:gap-0">
            <h1 className="bg-[#FF0266] text-[#6200EE] motion-preset-typewriter-[11] motion-duration-[4s] ">Materialism</h1>
            <h1 className="bg-[#F57F17] text-[#0039B3] motion-preset-typewriter-[3] motion-duration-[4s]">and</h1>
            <h1 className="bg-[#6200EE] text-[#FFDE03] motion-preset-typewriter-[11] motion-duration-[4s]">&quot;Happiness&quot;</h1>
          </span>
          <p className="md:text-[calc(4vw-max(20%,1.5rem))] font-semibold text-[#00C853] w-full p-5 motion-scale-in-[0.5] motion-translate-x-in-[-48%] motion-translate-y-in-[0%] motion-opacity-in-[50%]
          motion-blur-in-[10px] motion-duration-500">
            a web project developed and <br /> programmed by Josh Pham
          </p>
        </div>
        <p className="md:ps-[calc(59vw-clamp(2rem,4vw,6rem))] w-full text-left flex md:text-[calc(3vw-max(1vw,1rem))] font-semibold text-[#03DAC6]  after:content-['.'] after:animate-loadingDots 
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
