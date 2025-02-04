import { getGame } from "@/db-access/game";
import { AdminClient } from "./admin-game-page";
import { db } from "@/lib/db";
import { playerSessionTable } from "@/lib/schema/gameSchema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const AdminPage = async ({ 
    params 
}: { 
    params: Promise<{ gameId: string }>
}) => {
    const { gameId } = await params;
    if (!gameId) {
        return redirect("/admin");
        // return <div>Game not found</div>;
    }

    const game = await getGame(gameId);
    if (!game) {
        return redirect("/admin");
        // return <div>Game doesn&apos;t exist <Link href="/admin">Go back to admin</Link></div>;
    }    
    const people = async () => {
        console.log("fetching people");
        
        return await db.select({
            name: playerSessionTable.name, 
            deviceId: playerSessionTable.deviceId,
            score: playerSessionTable.score
        }).from(playerSessionTable).where(eq(playerSessionTable.gameId, game.id));
    };
    const initialPeople = await people();

    return (
        <main className="flex flex-col pt-4 gap-y-4 justify-start h-screen">
            <AdminClient game={game} initialPeople={initialPeople} />
        </main>
    )
};


export default AdminPage;