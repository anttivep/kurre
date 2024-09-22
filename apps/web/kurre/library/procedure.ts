import { z } from "zod";
import { MiddlewareFn } from "./kurre";

export type InputHandler<T extends z.ZodType<unknown>, Context> =
  T extends z.ZodType<infer Input>
    ? ({ input, ctx }: { input: Input; ctx: Context }) => any
    : never;

export type Handler<Context> = ({ ctx }: { ctx: Context }) => any;

export type InputQuery<T extends z.ZodType<unknown>, Context> = {
  type: "query";
  schema: z.ZodSchema;
  handler: InputHandler<T, Context>;
  middlewares: Array<MiddlewareFn<Context>>;
};
export type InputMutation<T extends z.ZodType<unknown>, Context> = {
  type: "mutation";
  schema: z.ZodSchema;
  handler: InputHandler<T, Context>;
  middlewares: Array<MiddlewareFn<Context>>;
};
export type Query<Context> = {
  type: "query";
  handler: Handler<Context>;
  middlewares: Array<MiddlewareFn<Context>>;
};

export type Mutation<Context> = {
  type: "mutation";
  handler: Handler<Context>;
  middlewares: Array<MiddlewareFn<Context>>;
};

export class Procedure<Context> {
  private readonly middlewares: MiddlewareFn<Context>[] = [];

  constructor(middlewares: Array<MiddlewareFn<Context>> = []) {
    this.middlewares = middlewares;
  }

  use(fn: MiddlewareFn<Context>): Procedure<Context> {
    return new Procedure([...this.middlewares, fn]);
  }

  input = <T extends z.ZodType<unknown>>(schema: T) => ({
    query: (fn: InputHandler<T, Context>): InputQuery<T, Context> => ({
      type: "query",
      schema,
      handler: fn,
      middlewares: this.middlewares,
    }),

    mutation: (fn: InputHandler<T, Context>): InputMutation<T, Context> => ({
      type: "mutation",
      schema,
      handler: fn,
      middlewares: this.middlewares,
    }),
  });

  query(fn: Handler<Context>): Query<Context> {
    return {
      type: "query",
      handler: fn,
      middlewares: this.middlewares,
    };
  }

  mutation(fn: Handler<Context>): Mutation<Context> {
    return {
      type: "mutation",
      handler: fn,
      middlewares: this.middlewares,
    };
  }
}
