
"use server"

import { db } from "@/lib/db";
import { getDeviceId } from "@/lib/deviceId";
import { adminTable } from "@/lib/schema/authSchema";
import { gameTable } from "@/lib/schema/gameSchema";
import { generateGameId, generateJoinCode } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const generateGame = async (time: number): Promise<{gameId: string}> => {
    const newGameId = generateGameId();
    await db.insert(gameTable).values({
        id: newGameId,
        code: generateJoinCode().toString(),
        started: false,
        ended: false,
        time: time,
        createdAt: new Date(),
    });
    return { gameId: newGameId };
}

export const signOutAction = async () => {
    await db.delete(adminTable).where(eq(adminTable.deviceId, await getDeviceId()));
    redirect("/");
}