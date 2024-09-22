import { NextRequest, NextResponse } from "next/server";
import { createContext } from "../../../kurre/context";
import { rpcHandler } from "../../../kurre/library/rpcHandler";
import { appRouter } from "../../../kurre/kurre";

async function handler(req: NextRequest) {
  const ctx = await createContext({ req });
  const data = await rpcHandler(req, appRouter, ctx);
  console.log("handler:", data);
  return NextResponse.json(data);
}

export { handler as POST };
