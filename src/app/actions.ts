"use server";

import * as z from "zod";
import { LoginSchema } from "@/lib/schema/formSchemas";
import { db } from "@/lib/db";
import { cookies } from 'next/headers'
import { adminTable } from "@/lib/schema/authSchema";

export const signInAction = async (values: z.infer<typeof LoginSchema>): Promise<boolean> => {
    const fields = LoginSchema.safeParse(values);
    
    if (!fields.success) {
        console.log(fields.error);
        return false;
    }


    if (values.password === process.env.INITIATE_PASSWORD) {
        const cookieStore = await cookies();
        const deviceIdCookie = cookieStore.get("deviceId");
        const deviceId = deviceIdCookie?.value;
        if (deviceId) {
            await db.insert(adminTable).values({ deviceId });
            return true;
        } else {
            console.log("No deviceId cookie found");
        }
    } else {
        console.log("Invalid password");
    }
    return false;
};
