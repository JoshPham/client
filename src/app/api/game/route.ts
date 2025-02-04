import { getGameByCode } from "@/db-access/game";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");


    if (!code) {
        return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    try {
        const game = await getGameByCode(code);
        console.table(game);
        return NextResponse.json(game);
    } catch (error) {
        return NextResponse.json(
        { error: `Failed to fetch game ${error}` },
        { status: 500 }
        );
    }
}