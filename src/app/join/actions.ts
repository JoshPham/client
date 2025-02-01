"use server";

import { db } from "@/lib/db";
import { gameTable } from "@/lib/schema/gameSchema";
import { eq } from "drizzle-orm";
