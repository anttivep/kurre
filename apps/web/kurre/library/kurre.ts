import { z } from "zod";
import {
  InputMutation,
  InputQuery,
  Mutation,
  Procedure,
  Query,
} from "./procedure";
import { router } from "./router";

export type MiddlewareFn<Context> = ({
  ctx,
  next,
}: {
  ctx: Context;
  next: (args?: Partial<Context>) => Promise<any>;
}) => Promise<any>;

export const initKurre = {
  context: <Context>() => ({
    create: () => ({
      middleware: (fn: MiddlewareFn<Context>) => fn,
      router: <
        T extends Record<
          string,
          | Query<Context>
          | Mutation<Context>
          | InputQuery<z.ZodType<any>, Context>
          | InputMutation<z.ZodType<any>, Context>
        >,
      >(
        routes: T
      ) => router<Context, T>(routes),
      procedure: new Procedure<Context>(),
    }),
  }),
  create: () => ({
    middleware: (fn: MiddlewareFn<unknown>) => fn,
    router: <
      T extends Record<
        string,
        | Query<unknown>
        | Mutation<unknown>
        | InputQuery<z.ZodType<any>, unknown>
        | InputMutation<z.ZodType<any>, unknown>
      >,
    >(
      routes: T
    ) => router<unknown, T>(routes),
    procedure: new Procedure<unknown>(),
  }),
};
