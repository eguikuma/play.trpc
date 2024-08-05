import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./server";

/**
 * tRPCインスタンスを作成
 *
 * アプリケーション内で単一になるようにする
 */
export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
