import type { z } from "zod";

import type { Task as Model } from "@/prisma/generated/client";

import type { QueueActions } from "../constants";
import type { CreateTask, DeleteTask, UpdateTask } from "../schema";

export type Task = Model;

export type CreateTaskInput = z.infer<typeof CreateTask>;

export type UpdateTaskInput = z.infer<typeof UpdateTask>;

export type DeleteTaskInput = z.infer<typeof DeleteTask>;

export type QueueAction = (typeof QueueActions)[keyof typeof QueueActions];

export type QueueValue = {
  action: QueueAction;
  id: number;
  data?: UpdateTaskInput;
};
