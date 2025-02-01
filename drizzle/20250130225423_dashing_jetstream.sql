CREATE TABLE "game" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text,
	"time" integer,
	"started" boolean,
	"ended" boolean,
	"createdAt" timestamp,
	"stoppedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "player_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"gameId" integer,
	"deviceId" text,
	"score" integer,
	"name" text
);
