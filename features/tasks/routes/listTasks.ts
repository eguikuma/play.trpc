import { procedure } from "@/utils/trpc/factories";

export const listTasks = procedure.query(async ({ ctx: { db } }) => {
  return await db.task.findMany({ orderBy: { id: "desc" } });
});
