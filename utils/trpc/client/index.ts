import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "../server";

/**
 * クライアントサイド用のtRPCクライアントを作成
 */
export const trpc = createTRPCReact<AppRouter>();
