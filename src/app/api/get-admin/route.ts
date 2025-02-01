import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminTable } from "@/lib/schema/authSchema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = await cookies();
    const deviceId = cookieStore.get("deviceId")?.value;

    if (!deviceId) {
        return NextResponse.json({ isAdmin: false });
    }

    const response = await db
        .select()
        .from(adminTable)
        .where(eq(adminTable.deviceId, deviceId));

    if (response.length > 0) {
        return NextResponse.json({ isAdmin: true });
    } else {
        return NextResponse.json({ isAdmin: false });
    }
}