import { Flex, Text } from "@mantine/core";

import type { Task } from "../definitions";

type TaskTotalProps = {
  tasks: Task[];
};

export const TaskTotal = ({ tasks = [] }: TaskTotalProps) => {
  return (
    <Flex justify="end" gap="xl">
      <Text className="font-bold" size="sm" c="dimmed">
        合計タスク: {tasks.length}
      </Text>
      <Text className="font-bold" size="sm" c="dimmed">
        完了タスク: {tasks.filter(({ completed }) => completed).length}
      </Text>
    </Flex>
  );
};
