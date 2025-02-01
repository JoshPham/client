import { cookies } from "next/headers";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

export function generateToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export const getDeviceId = async (): Promise<string> => {
    const cookieStore = await cookies();
    const deviceId = cookieStore.get("deviceId");
    return deviceId!.value;
};