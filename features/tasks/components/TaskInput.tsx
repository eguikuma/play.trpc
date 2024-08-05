import { useCallback } from "react";

import { Button, Flex, Text, TextInput } from "@mantine/core";

import { useValidator } from "@/hooks";
import { trpc } from "@/utils/trpc/client";

import { CreateTask } from "../schema";

export const TaskInput = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.tasks.create.useMutation();
  const validator = useValidator({
    schema: CreateTask,
    defaultValues: { title: "" },
  });

  const addTask = useCallback(
    async () =>
      validator.validate({
        onSuccess: (newTask) =>
          mutation.mutate(newTask, {
            onSuccess: () => {
              validator.resetField("title");
              utils.tasks.list.invalidate();
            },
          }),
      }),
    [mutation, validator, utils.tasks.list],
  );

  return (
    <Flex direction="column" gap={{ base: "sm", sm: 6 }}>
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={{ base: 0, sm: "md" }}
        align={{ base: "flex-start", md: "center" }}
      >
        <TextInput
          className="w-full md:flex-1"
          classNames={{
            input: "rounded-t-md! rounded-b-none! md:rounded-sm! font-bold",
          }}
          {...validator.register("title")}
          placeholder="新しいタスクを入力"
          error={!!validator.formState.errors.title?.message}
          autoFocus
        />
        <Button
          className="w-full! md:w-fit! rounded-b-md! rounded-t-none! md:rounded-sm!"
          loading={mutation.isPending}
          loaderProps={{ type: "dots" }}
          disabled={mutation.isPending}
          onClick={addTask}
        >
          タスクを追加
        </Button>
      </Flex>
      <Text className="font-bold" size="xs" c="dimmed">
        ※ 1~100文字まで入力できます
      </Text>
    </Flex>
  );
};
