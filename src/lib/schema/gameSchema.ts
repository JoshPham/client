import { serial, integer, timestamp, text, pgTable, boolean } from "drizzle-orm/pg-core";


export const gameTable = pgTable("game", {
    id: text("id").primaryKey(),
    code: text("code"),
    time: integer("time"), // in seconds
    started: boolean("started"),
    ended: boolean("ended"),
    createdAt: timestamp("createdAt"),
    // updatedAt: timestamp("updatedAt"),
    stoppedAt: timestamp("stoppedAt"),
});

export const playerSessionTable = pgTable("player_session", {
    id: serial("id").primaryKey(),
    gameId: text("gameId"),
    deviceId: text("deviceId"),
    score: integer("score"),
    name: text("name"),
});

export type Game = typeof gameTable.$inferSelect;