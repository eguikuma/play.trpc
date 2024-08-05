import { procedure } from "@/utils/trpc/factories";

import { CreateTask } from "../schema";

export const createTask = procedure
  .input(CreateTask)
  .mutation(async ({ input, ctx: { db, revalidate } }) => {
    await db.task.create({ data: input });

    revalidate("/");
  });
