import { revalidatePath } from "next/cache";

import { db } from "@/utils/db";

import { t } from "./instance";

/**
 * tRPCルーターを作成
 *
 * ルーターにエンドポイントを追加する
 */
export const router = t.router;

/**
 * tRPCプロシージャを作成
 *
 * クライアントに公開する関数を作成する
 */
export const procedure = t.procedure.use(({ ctx, next }) =>
  next({ ctx: { ...ctx, db, revalidate: revalidatePath } }),
);

/**
 * tRPCルーターのサーバー側呼び出し元を作成する
 *
 * バックエンド側でのプロシージャ呼び出しを可能にする
 */
export const createCallerFactory = t.createCallerFactory;
