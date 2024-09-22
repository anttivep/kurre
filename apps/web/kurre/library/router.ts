import { z } from "zod";
import { InputMutation, InputQuery, Mutation, Query } from "./procedure";

export function router<
  Context,
  T extends Record<
    string,
    | Query<Context>
    | Mutation<Context>
    | InputQuery<z.ZodType<any>, Context>
    | InputMutation<z.ZodType<any>, Context>
  >,
>(obj: T): T {
  return obj;
}
