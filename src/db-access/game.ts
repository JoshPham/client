import { db } from "@/lib/db";
import { Game, gameTable } from "@/lib/schema/gameSchema";
import { eq } from "drizzle-orm";


export async function checkGameExists(gameId: string): Promise<boolean> {
    const response = await db.select().from(gameTable).where(eq(gameTable.id, gameId));
    if (response.length > 0) {
        return true;
    } else {
        return false;
    }
}

export async function getGame(gameId: string) : Promise<Game> {
    const response = await db.select().from(gameTable).where(eq(gameTable.id, gameId));
    return response[0];
}

export async function getGameByCode(code: string) : Promise<Game> {
    const response = await db.select().from(gameTable).where(eq(gameTable.code, code));
    return response[0];
}