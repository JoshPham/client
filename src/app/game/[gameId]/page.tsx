import { getGame } from "@/db-access/game";
import GamePage from "./game-page";
import { getPlayerSession } from "@/db-access/session";
import { getDeviceId } from "@/lib/deviceId";
import { redirect } from "next/navigation";

const Page = async ({ 
    params 
}: { 
    params: Promise<{ gameId: string }>
}) => {
    const { gameId } = await params;
    if (!gameId) {

            return redirect("/join");
        // return (
        //     <div>Game not found</div>
        // );
    }

    const game = await getGame(gameId);
    if (!game) {
        return redirect("/join");
        // return <div>Game doesn&apos;t exist</div>;
    }
    const playerSession = await getPlayerSession(gameId);
    const deviceId = await getDeviceId();

    return (
        <main className="flex flex-col px-28 pt-4 gap-y-4 justify-start h-screen">
            <GamePage game={game} playerSession={playerSession} deviceId={deviceId} />
        </main>
    )
};

export default Page;
