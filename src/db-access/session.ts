import { db } from "@/lib/db";
import { getDeviceId } from "@/lib/deviceId";
import { adminTable } from "@/lib/schema/authSchema";
import { eq } from "drizzle-orm";


export default async function getAdmin(): Promise<boolean> {
    const deviceId = await getDeviceId();
    const response = await db.select().from(adminTable).where(eq(adminTable.deviceId, deviceId))
    if (response.length > 0) {
        return true;
    } else {
        return false;
    }
}