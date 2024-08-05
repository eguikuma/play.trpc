"use client";

import { Flex, ScrollArea } from "@mantine/core";

import { trpc } from "@/utils/trpc/client";

import type { Task } from "../definitions";
import { TaskInput } from "./TaskInput";
import { TaskList } from "./TaskList";
import { TaskTotal } from "./TaskTotal";

type TaskWrapperProps = {
  defaultTasks: Task[] | undefined;
};

export const TaskWrapper = ({ defaultTasks = [] }: TaskWrapperProps) => {
  const { data: tasks } = trpc.tasks.list.useQuery(undefined, {
    initialData: defaultTasks,
  });

  return (
    <Flex direction="column" gap="md" className="overflow-hidden">
      <TaskInput />
      <TaskTotal tasks={tasks} />
      <ScrollArea scrollbars="y">
        <TaskList tasks={tasks} />
      </ScrollArea>
    </Flex>
  );
};
