import { signOutAction } from "./actions";


export function SignOutButton() {

    return (
        <form action={signOutAction}>
            <button type="submit" className="bg-white text-black px-4 py-2 text-xl font-bold rounded-md hover:bg-slate-200">
                Sign Out
            </button>
        </form>
    );
}