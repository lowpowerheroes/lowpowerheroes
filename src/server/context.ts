// context.ts
import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

export const createContext = async ({ req }: { req: NextRequest }) => {
  const { userId, sessionId, getToken } = await auth();

  return {
    db,
    headers: req.headers,
    auth: { userId, sessionId, getToken },
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
