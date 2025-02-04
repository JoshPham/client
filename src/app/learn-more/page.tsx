"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const data1 = {
  labels: ["Very well off financially", "Other"],
  datasets: [
    {
      data: [42, 58],
      backgroundColor: ["#fadf4b", "#3204ac"],
      hoverBackgroundColor: ["F8E359590de5", "#590de5"],
    },
  ],
};

const data2 = {
    labels: ["Very well off financially", "Other"],
    datasets: [
      {
        data: [82, 18],
        backgroundColor: ["#fadf4b", "#3204ac"],
        hoverBackgroundColor: ["F8E359590de5", "#590de5"],
      },
    ],
};
  


export default function LearnMorePage() {
    const [page, setPage] = useState(1);
    const [isFading, setIsFading] = useState(false);

    const handleNextPage = (pageNum: number) => {
        setIsFading(true);
        setTimeout(() => {
            setPage(pageNum);
            setIsFading(false);
        }, 500);
    }

    if (page === 1) {
        return (
            <main className={`flex flex-col p-10 gap-y-4 justify-between items-start pt-10 pb-20 ps-28 gap-28 h-screen ${isFading ? "motion-opacity-out-[0%] motion-duration-300" : "motion-opacity-in-[0%] motion-duration-2000"}`}>
                <span className="flex flex-col gap-y-10 h-full">
                    <h1 className="font-bold text-[#6200EE] text-5xl block">
                        What did you just witness?
                    </h1>
                    <p className="text-4xl text-[#00C853] block">
                        You just experienced the idea of <span className="text-[#03DAC6] font-bold">Materialism</span> an ideology that favors material possessions over spiritual values.
                        <br />
                        <br />
                        Regardless of how positive or negative we felt, all of these feelings caused by this game can fall under the influence of materialism.

                    </p>
                </span>
                <br />
                <br />
                <span className="flex justify-center w-full">
                    <button className="bg-[#03DAC6] text-3xl px-20 py-2 rounded-md text-black font-bold hover:bg-[#3ae7d6] transition-all duration-150 ease-in-out" 
                        onClick={() => handleNextPage(2)}
                    >
                        Click to view more -{">"}
                    </button>
                </span>
            </main>
        )
    }

    if (page === 2) {
        return (
            <main className={`flex flex-col p-10 gap-y-2 justify-between items-start ps-28 gap-28 min-h-screen ${isFading ? "motion-opacity-out-[0%] motion-duration-300" : "motion-opacity-in-[0%]"}`}
            
            >
                <button
                    className="group text-2xl hover:motion-translate-x-out-[-16%]"
                    onClick={() => handleNextPage(1)}
                >
                        {"<"}- Go Back
                </button>
                <section className="flex flex-col pt-10 pb-20 justify-start h-[150vh]">
                    <motion.span className="flex flex-col gap-y-10  item"
                        initial={
                            { opacity: 0 }
                        }
                        whileInView={{ opacity: 1 }}
                        viewport={{ amount: 1 }}
                    >
                        <h1 className="font-bold text-[#6200EE] text-5xl block">
                            My Research
                        </h1>
                        <p
                            className="text-4xl text-[#00C853] block"
                        >
                            I conducted a study on the effects of materialism on mental health and well-being.
                            <br />
                            <br />
                            Here are some of the key findings (scroll):
                        </p>
                    </motion.span>
                </section>
                <motion.section className="flex flex-col h-[120vh]"
                    initial={
                        { opacity: 0 }
                    }
                    whileInView={{ opacity: 1 }}
                    viewport={{ amount: 0.2}}
                >
                    <h1
                        className="font-bold text-5xl block underline text-[#FF0266]"> 
                        Materialism is associated with lower levels of well-being.
                    </h1>
                    <Link className="flex flex-row gap-x-2 text-4xl text-[#03DAC6] font-bold underline hover:no-underline"
                        href="/citations"
                    >
                        (Kasser)
                    </Link>

                </motion.section>
                <motion.section className="flex flex-col h-[120vh] w-full gap-10"
                    initial={
                        { opacity: 0 }
                    }
                    whileInView={{ opacity: 1 }}
                    viewport={{ amount: 0.3}}
                >
                    <div className="flex justify-center w-full">
                        <Card className="p-4 w-full max-w-md mx-auto">
                            <h2 className="text-xl font-bold text-center mb-4 text-white">
                                People's Important Goals in 1967
                            </h2>
                            <CardContent className="flex justify-center">
                                <Pie data={data1} className="text-white "/>
                            </CardContent>
                        </Card>
                        <motion.div className="w-full max-w-md mx-auto"
                            initial={
                                { opacity: 0 }
                            }
                            whileInView={{ opacity: 1 }}
                            viewport={{ amount: 0.2}}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="p-4 w-full h-full max-w-md mx-auto">
                                <h2 className="text-xl font-bold text-center mb-4 text-white">
                                    People's Important Goals in 1967
                                </h2>
                                <CardContent className="flex justify-center">
                                    <Pie data={data2} className="text-white "/>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                    <Link
                        href="/citations"
                        className="flex flex-row gap-x-2 text-4xl text-[#FFDE03] font-bold underline hover:no-underline"
                    >
                        (Lieber)
                    </Link>
                    

                </motion.section>
                <motion.section className="flex flex-col gap-y-10 h-[120vh]"
                    initial={
                        { opacity: 0 }
                    }
                    whileInView={{ opacity: 1 }}
                    viewport={{ amount: 0.2}}
                >
                    <div className="grid grid-cols-2 gap-x-32">
                        <motion.div className="flex flex-col gap-y-2"
                            initial={
                                { opacity: 0 }
                            }
                            whileInView={{ opacity: 1 }}
                            viewport={{ amount: 0.2}}
                        >
                            <h1 className="font-bold text-5xl block underline text-[#00C853]">
                                Material aspirations have historically led to increased productivity and innovation
                            </h1>
                            <Link
                                href="/citations"
                                className="flex flex-row gap-x-2 text-4xl text-[#6200EE] font-bold underline hover:no-underline"
                            >
                                (Salam)
                            </Link>
                        </motion.div>
                        <motion.div className="flex flex-col gap-y-2 items-start w-full"
                            initial={
                                { opacity: 0 }
                            }
                            whileInView={{ opacity: 1 }}
                            viewport={{ amount: 0.2}}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="font-bold text-5xl block underline text-[#63D02D]">
                                Consumerism improves the economy, which leads to a better quality of life
                            </h1>
                            <Link
                                href="/citations"
                                className="flex flex-row gap-x-2 text-4xl text-[#00C853] font-bold underline hover:no-underline"
                            >
                                ("Consumerism")
                            </Link>
                        </motion.div>
                    </div>

                </motion.section>
                <motion.section className="flex flex-col gap-y-10 h-[120vh]"
                    initial={
                        { opacity: 0 }
                    }
                    whileInView={{ opacity: 1 }}
                    viewport={{ amount: 0.2}}
                >
                    <div className="">
                        <motion.div className="flex flex-col gap-y-2"
                            initial={
                                { opacity: 0 }
                            }
                            whileInView={{ opacity: 1 }}
                            viewport={{ amount: 0.2}}
                        >
                            <h1 className="text-5xl block text-[#63D02D]">
                                At the end of the day, {" "}
                                <span className="font-bold text-[#FF0266]">
                                     materialism prevents us from developing spiritually and morally. It just makes us selfish and greedy.
                                </span>
                            </h1>
                            <Link
                                href="/citations"
                                className="flex flex-row gap-x-2 text-4xl text-[#F57F17] font-bold underline hover:no-underline"
                            >
                                ("Dr. Spock's Last Interview.")
                            </Link>
                        </motion.div>
                    </div>
                </motion.section>
                <motion.section className="flex flex-col gap-y-10 h-[120vh] w-full"
                    initial={
                        { opacity: 0 }
                    }
                    whileInView={{ opacity: 1 }}
                    viewport={{ amount: 0.2}}
                >
                    <h1 className="w-full text-center flex justify-center text-5xl font-bold text-[#FFDE03]">
                        Thank you.
                    </h1>
                </motion.section>
            </main>
        )
    }
}