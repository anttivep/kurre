import { NextRequest, NextResponse } from "next/server";
import { db } from "./db";

type CreateNextContextOptions = {
  req: NextRequest;
  res?: NextResponse;
};

export async function getSession(req: NextRequest): Promise<{
  user: { id: number; isAdmin: boolean };
}> {
  return new Promise((resolve) => resolve({ user: { id: 1, isAdmin: true } }));
}

export async function createContext(opts: CreateNextContextOptions) {
  const session = await getSession(opts.req);

  return {
    session,
    db,
  };
}

export type Ctx = Awaited<ReturnType<typeof createContext>>;
