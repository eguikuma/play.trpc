import * as routes from "@/routes";

import { createCallerFactory, router } from "../factories";

/**
 * アプリケーションのtRPCルーターを作成
 */
export const appRouter = router({
  ...routes,
});

/**
 * tRPCルーターの型を公開
 */
export type AppRouter = typeof appRouter;

/**
 * サーバーサイド用のtRPCクライアントを作成
 */
export const trpc = createCallerFactory(appRouter)({});

/**
 * tRPCコンテキストを作成
 */
export const createContext = () => ({});

/**
 * tRPCコンテキストの型を公開
 */
export type Context = Awaited<ReturnType<typeof createContext>>;
