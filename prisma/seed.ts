import { db } from "@/utils/db";

const main = async () => {
  await db.task.createMany({
    data: [
      {
        title: "タスクA",
        completed: false,
      },
      {
        title: "タスクB",
        completed: true,
      },
      {
        title: "タスクC",
        completed: false,
      },
      {
        title: "タスクD",
        completed: true,
      },
    ],
  });
};

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
