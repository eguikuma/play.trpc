import { z } from "zod";

const TaskTitle = z
  .string()
  .min(1, "最低1文字以上入力してください")
  .max(100, "最大100文字まで入力してください");

const CreateTask = z.object({
  title: TaskTitle,
});

const UpdateTask = z.object({
  id: z.number(),
  title: TaskTitle,
  completed: z.boolean(),
  pending: z.boolean().nullish(),
});

const DeleteTask = z.object({
  id: z.number(),
});

export { CreateTask, DeleteTask, UpdateTask };
