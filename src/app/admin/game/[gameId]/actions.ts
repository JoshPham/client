"use server"

import { db } from "@/lib/db";
import { gameTable, playerSessionTable } from "@/lib/schema/gameSchema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const kickPlayer = async (gameId: string, deviceId: string) => {
    console.log("Kicking player with deviceId", deviceId);
    await db.delete(playerSessionTable).where(eq(playerSessionTable.deviceId, deviceId));
    revalidatePath(`/admin/game/${gameId}`);
}

export const setGameStarted = async (gameId: string) => {
    await db.update(gameTable).set({started: true}).where(eq(gameTable.id, gameId));
}

export const setGameEnded = async (gameId: string) => {
    await db.update(gameTable).set({ended: true}).where(eq(gameTable.id, gameId));
}