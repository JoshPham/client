"use server";

import { cookies } from 'next/headers'
import { db } from "@/lib/db";
import { playerSessionTable } from '@/lib/schema/gameSchema';

export async function joinGame(gameId: string, name: string) {
    const cookieStore = await cookies();
    const deviceId = cookieStore.get("deviceId")?.value;

    await db.insert(playerSessionTable).values({ 
        gameId: gameId,
        deviceId: deviceId,
        score: 0,
        name: name
     });
}