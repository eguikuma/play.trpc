import { procedure } from "@/utils/trpc/factories";

import { DeleteTask } from "../schema";

export const deleteTask = procedure
  .input(DeleteTask)
  .mutation(async ({ input, ctx: { db, revalidate } }) => {
    await db.task.delete({ where: { id: input.id } });

    revalidate("/");
  });
