import { z } from "zod";
import { Ctx } from "./context";
import { initKurre } from "./library/kurre";

const kurre = initKurre.context<Ctx>().create();

const exampleMiddleware = kurre.middleware(async ({ ctx, next }) => {
  console.log("exampleMiddleware running", ctx);
  const modifiedCtx = { ...ctx, newProperty: "value" };
  console.log("exampleMiddleware ran", modifiedCtx);
  return next(modifiedCtx);
});

const adminMiddleware = kurre.middleware(async ({ ctx, next }) => {
  console.log("authMiddleware ran", ctx);
  if (!ctx.session?.user.isAdmin) {
    throw new Error();
  }

  next({
    session: {
      user: ctx.session.user,
    },
  });
});

export const router = kurre.router;
export const baseProcedure = kurre.procedure;
export const publicProcedure = baseProcedure.use(exampleMiddleware);
export const protectedProcedure = baseProcedure.use(adminMiddleware);

export const appRouter = router({
  queryExample: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log("queryExample", ctx, input);
      return { message: `Hello ${input.name}` };
    }),
  queryDatabaseExample: publicProcedure.query(async ({ ctx }) => {
    console.log("queryDatabaseExample");
    return await ctx.db.user.findMany();
  }),
  queryExampleNoInput: publicProcedure.query(async ({ ctx }) => {
    console.log("queryNoInputExample", ctx);
    return { message: `Hello` };
  }),
  queryExampleProtected: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log("queryExample", ctx, input);
      return { message: `Hello ${input.name}` };
    }),
  mutationExample: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(({ ctx, input }) => {
      console.log("mutationExample", ctx, input);
      return { message: input.message };
    }),
  mutationDatabaseExample: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log("mutationDatabaseExample", ctx, input);
      const user = await ctx.db.user.create({ name: input.name });
      return user;
    }),
  mutationExampleProtected: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(({ ctx, input }) => {
      console.log("mutationExample", ctx, input);
      return { message: input.message };
    }),
});

export type AppRouter = typeof appRouter;
