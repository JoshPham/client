"use server";

import { cookies } from 'next/headers'
import { db } from "@/lib/db";
import { playerSessionTable } from '@/lib/schema/gameSchema';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function joinGame(gameId: string, name: string) {
    const cookieStore = await cookies();
    const deviceId = cookieStore.get("deviceId")?.value || "unknown_device";

    await db.insert(playerSessionTable).values({ 
        gameId: gameId,
        deviceId: deviceId,
        score: 0,
        name: name
     });
}

export async function addPoints(gameId: string, deviceId: string, curr: number, points: number) {
    console.log(curr)
    if (!curr) {
        curr = 0;
    }
    
    console.log(gameId, deviceId, curr, points);
    await db.update(playerSessionTable).set({ score: curr + points }).where(
        and(
            eq(playerSessionTable.gameId, gameId),
            eq(playerSessionTable.deviceId, deviceId)
        )
    );
    revalidatePath(`/game/${gameId}`);
}