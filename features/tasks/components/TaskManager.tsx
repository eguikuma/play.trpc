import { Container, Flex, Paper, Title } from "@mantine/core";

import { trpc } from "@/utils/trpc/server";

import { TaskWrapper } from "./TaskWrapper";

export const TaskManager = async () => {
  const defaultTasks = await trpc.tasks.list();

  return (
    <div className="flex flex-col items-center w-full xl:max-w-[700px] h-dvh min-h-1 xl:max-h-[calc(100vh-64px)] py-4 rounded-sm bg-[#f0f2f5]">
      <Container size="lg" className="size-full">
        <Paper shadow="md" p="xl" radius="md" withBorder className="size-full">
          <Flex direction="column" gap="xl" className="size-full">
            <Title
              order={1}
              ta="center"
              className="text-[#2c3e50] text-2xl! md:text-3xl!"
            >
              tRPC Tasks
            </Title>
            <TaskWrapper defaultTasks={defaultTasks} />
          </Flex>
        </Paper>
      </Container>
    </div>
  );
};
