import { z } from "zod";
import { InputMutation, InputQuery, Mutation, Query } from "./procedure";

export type Router<Context> = Record<
  string,
  | Query<Context>
  | Mutation<Context>
  | InputQuery<z.ZodType<any>, Context>
  | InputMutation<z.ZodType<any>, Context>
>;

export function router<Context, T extends Router<Context>>(obj: T): T {
  return obj;
}
