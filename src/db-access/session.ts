import { db } from "@/lib/db";
import { getDeviceId } from "@/lib/deviceId";
import { adminTable } from "@/lib/schema/authSchema";
import { playerSessionTable } from "@/lib/schema/gameSchema";
import { and, eq } from "drizzle-orm";

export async function getAdmin(): Promise<boolean> {
    const deviceId = await getDeviceId();
    const response = await db.select().from(adminTable).where(eq(adminTable.deviceId, deviceId))
    if (response.length > 0) {
        return true;
    } else {
        return false;
    }
}

export async function getPlayerSession(gameId: string) {
    const deviceId = await getDeviceId();
    const response = await db.select().from(playerSessionTable).where(
        and(
            eq(playerSessionTable.deviceId, deviceId),
            eq(playerSessionTable.gameId, gameId)
        )
    );
    return response[0];
}
