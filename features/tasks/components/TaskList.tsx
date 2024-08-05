import { useCallback, useRef } from "react";

import { Transition } from "@headlessui/react";
import {
  Checkbox,
  CloseButton,
  Flex,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { debounce } from "lodash";
import { useTimeout } from "react-use";

import { Keys } from "@/constants";
import { useValidator } from "@/hooks";
import { trpc } from "@/utils/trpc/client";
import { asArray } from "@/utils/zod";

import { QueueActions } from "../constants";
import type {
  DeleteTaskInput,
  QueueValue,
  Task,
  UpdateTaskInput,
} from "../definitions";
import { UpdateTask } from "../schema";

type TaskListProps = {
  tasks: Task[];
};

export const TaskList = ({ tasks = [] }: TaskListProps) => {
  const utils = trpc.useUtils();
  const queues = useRef<Map<number, QueueValue>>(new Map());
  const [animatingAdded] = useTimeout(500);

  const mutations = {
    update: trpc.tasks.update.useMutation({
      onMutate: () => ({ previousTasks: utils.tasks.list.getData() }),
      onError: (_, __, context) => {
        if (context?.previousTasks) {
          utils.tasks.list.setData(undefined, context.previousTasks);
        }
      },
    }),
    delete: trpc.tasks.delete.useMutation({
      onMutate: () => ({ previousTasks: utils.tasks.list.getData() }),
      onError: (_, __, context) => {
        if (context?.previousTasks) {
          utils.tasks.list.setData(undefined, context.previousTasks);
        }
      },
    }),
  };

  const validator = useValidator({
    schema: asArray(UpdateTask, "tasks"),
    defaultValues: {
      tasks,
    },
  });
  const validatorAsArray = validator.asArray("tasks");

  /**
   * biome-ignore lint/correctness/useExhaustiveDependencies: デバウンス処理のためキャッシュが必要
   */
  const dequeue = useCallback(
    debounce(async (id: number) => {
      const queue = queues.current.get(id);

      if (!queue) return;

      try {
        switch (queue.action) {
          case QueueActions.Update:
            if (!queue.data) return;

            await mutations.update.mutateAsync(queue.data);

            break;
          case QueueActions.Delete:
            await mutations.delete.mutateAsync({ id: queue.id });

            break;
          default:
            break;
        }
      } finally {
        queues.current.delete(id);
      }
    }, 300),
    [mutations.update, mutations.delete],
  );

  const pendingTask = useCallback(
    (index: number, task: UpdateTaskInput) =>
      validatorAsArray.update(index, { ...task, pending: true }),
    [validatorAsArray],
  );

  const fixedTask = useCallback(
    (index: number, task: UpdateTaskInput) =>
      validatorAsArray.update(index, { ...task, pending: false }),
    [validatorAsArray],
  );

  const updateTask = useCallback(
    async (index: number, { pending: _pending, ...task }: UpdateTaskInput) => {
      validator.validate({
        onSuccess: () => {
          utils.tasks.list.setData(undefined, (previous) => {
            if (!previous) return previous;

            return previous.map((previousTask) =>
              previousTask.id === task.id
                ? { ...previousTask, ...task }
                : previousTask,
            );
          });

          fixedTask(index, task);

          queues.current.set(task.id, {
            action: QueueActions.Update,
            id: task.id,
            data: task,
          });

          dequeue(task.id);
        },
      });
    },
    [validator, fixedTask, utils.tasks.list, dequeue],
  );

  const deleteTask = useCallback(
    async (task: DeleteTaskInput) => {
      utils.tasks.list.setData(undefined, (previous) => {
        if (!previous) return previous;

        return previous.filter((previousTask) => previousTask.id !== task.id);
      });

      queues.current.set(task.id, {
        action: QueueActions.Delete,
        id: task.id,
      });

      dequeue(task.id);
    },
    [utils.tasks.list, dequeue],
  );

  return (
    <Flex direction="column" gap="lg" className="my-2">
      {validatorAsArray.tasks.map((task, index) => (
        <Transition
          key={task.id}
          appear={!!animatingAdded()}
          show={true}
          enter="transition-all ease-in-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition-all ease-in-out duration-300"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Paper
            shadow="sm"
            p="md"
            radius="md"
            mah={68}
            withBorder
            classNames={{
              root: `!cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-6 hover:shadow-md ${
                validator.formState.errors.tasks?.[index]?.title?.message
                  ? "border-red-400! border-2! "
                  : ""
              }${
                task.pending
                  ? "border-blue-400! border-2! hover:bg-transparent!"
                  : ""
              }`,
            }}
            onClick={() =>
              !task.completed && !task.pending && pendingTask(index, task)
            }
          >
            <Flex justify="space-between" align="center">
              <Flex align="center" gap="md" className="flex-1! overflow-hidden">
                <Checkbox
                  size="md"
                  classNames={{ input: "cursor-pointer!" }}
                  checked={task.completed}
                  {...validator.register(`tasks.${index}.completed`, {
                    onChange: (e) => {
                      e.stopPropagation();

                      updateTask(index, {
                        ...task,
                        completed: e.target.checked,
                      });
                    },
                  })}
                />
                {task.completed && (
                  <Text
                    size="lg"
                    truncate
                    className="line-through! text-[#888]! font-bold"
                  >
                    {task.title}
                  </Text>
                )}
                {!task.completed && (
                  <Flex
                    h={36}
                    align="center"
                    className="overflow-hidden w-full!"
                  >
                    {task.pending && (
                      <TextInput
                        className="w-full!"
                        variant="unstyled"
                        classNames={{
                          input:
                            "max-h-[36px]! text-[1.15rem]! font-bold text-[#333]! w-full!",
                        }}
                        {...validator.register(`tasks.${index}.title`, {
                          onBlur: (e) => {
                            e.stopPropagation();

                            if (e.target.value !== task.title) {
                              updateTask(index, {
                                ...task,
                                title: e.target.value,
                              });
                            } else {
                              fixedTask(index, task);
                            }
                          },
                        })}
                        onKeyDown={(e) => {
                          if (e.key === Keys.Enter) {
                            e.preventDefault();

                            e.currentTarget.blur();
                          }
                        }}
                        autoFocus
                      />
                    )}
                    {!task.pending && (
                      <Text
                        size="lg"
                        truncate
                        className="text-[#333]! w-full! font-bold"
                      >
                        {task.title}
                      </Text>
                    )}
                  </Flex>
                )}
              </Flex>
              <CloseButton
                size="lg"
                className="hover:bg-gray-200! dark:!hover:bg-dark-6"
                onClick={(e) => {
                  e.stopPropagation();

                  deleteTask({ id: task.id });
                }}
              />
            </Flex>
          </Paper>
        </Transition>
      ))}
    </Flex>
  );
};
