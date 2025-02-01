import { getGame } from "@/db-access/game";
import GamePage from "./game-page";

const Page = async ({ 
    params 
}: { 
    params: { gameId: string }
}) => {
    const { gameId } = await params;
    if (!gameId) {
        return (
            <div>Game not found</div>
        );
    }

    const game = await getGame(gameId);
    if (!game) {
        return <div>Game doesn't exist</div>;
    }

    return (
        <main className="flex flex-col px-32 pt-4 gap-y-4 justify-start h-screen">
            <GamePage game={game} />
        </main>
    )
};

export default Page;
