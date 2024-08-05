import { procedure } from "@/utils/trpc/factories";

import { UpdateTask } from "../schema";

export const updateTask = procedure
  .input(UpdateTask)
  .mutation(async ({ input, ctx: { db, revalidate } }) => {
    await db.task.update({ where: { id: input.id }, data: input });

    revalidate("/");
  });
