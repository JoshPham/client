
import { SignOutButton } from "./sign-out-button";
import { AdminPageComponent } from "./admin-page-component";

export default async function AdminPage() {
    return (
        <div className="flex flex-col p-10 gap-y-4 justify-start">
            <AdminPageComponent />
            <SignOutButton />
        </div>
    );
}