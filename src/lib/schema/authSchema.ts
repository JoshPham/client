import { text, pgTable, serial } from "drizzle-orm/pg-core";

export const adminTable = pgTable("admin", {
    id: serial("id").primaryKey(),
    deviceId: text("deviceId"),
});