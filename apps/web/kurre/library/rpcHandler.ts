import { z } from "zod";
import { InputMutation, InputQuery, Mutation, Query } from "./procedure";
import { NextRequest } from "next/server";

export async function rpcHandler<
  Context,
  T extends Record<
    string,
    | Query<Context>
    | Mutation<Context>
    | InputQuery<z.ZodType<any>, Context>
    | InputMutation<z.ZodType<any>, Context>
  >,
>(req: NextRequest, appRouter: T, ctx: Context) {
  const request = await req.json();
  try {
    const operation = appRouter[request.method];

    if (!operation) {
      throw new Error(`Method ${request.method} not found`);
    }

    for (const middleware of operation.middlewares) {
      await middleware({
        ctx,
        next: async (ctx) => ctx,
      });
    }

    if ("schema" in operation && operation.schema) {
      const parsed = operation.schema.parse(request.params);

      const result = await operation.handler({ input: parsed, ctx });

      return {
        jsonrpc: "2.0",
        id: request.id,
        result,
      };
    } else {
      const result = await operation.handler({
        input: request.params,
        ctx,
      });

      return {
        jsonrpc: "2.0",
        id: request.id,
        result,
      };
    }
  } catch (error: unknown) {
    return {
      jsonrpc: "2.0",
      id: request.id,
      error: {
        code: -32603,
        message: "Internal error",
        data: error instanceof Error ? error.message : error,
      },
    };
  }
}
