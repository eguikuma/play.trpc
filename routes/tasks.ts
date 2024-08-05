import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from "@/features/tasks/routes";
import { router } from "@/utils/trpc/factories";

export const tasks = router({
  list: listTasks,
  create: createTask,
  update: updateTask,
  delete: deleteTask,
});
