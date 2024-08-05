"use client";

import { useCallback, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "lodash";
import {
  type ArrayPath,
  type FieldArrayWithId,
  type FieldErrors,
  type Resolver,
  useFieldArray,
  type UseFieldArrayReturn,
  useForm,
  type UseFormProps,
} from "react-hook-form";
import type { z, ZodObject, ZodRawShape } from "zod";

type SchemaObject<T extends ZodRawShape> = ZodObject<T>;

type Schema<T extends ZodRawShape> = z.infer<SchemaObject<T>>;

type ValidateProps<T extends ZodRawShape> = {
  onSuccess: (data: Schema<T>) => unknown;
  onError?: (errors: FieldErrors<SchemaObject<T>>) => unknown;
};

type UseValidatorProps<T extends ZodRawShape> = UseFormProps<Schema<T>> & {
  schema: SchemaObject<T>;
};

export const useValidator = <T extends ZodRawShape>({
  schema,
  defaultValues,
  ...props
}: UseValidatorProps<T>) => {
  const { formState, getValues, reset, trigger, ...form } = useForm<Schema<T>>({
    ...props,
    resolver: zodResolver(schema) as Resolver<Schema<T>>,
  });

  useEffect(() => {
    if (isEqual(formState?.defaultValues, defaultValues)) return;

    reset(defaultValues as Schema<T>);
  }, [defaultValues, reset, formState?.defaultValues]);

  const validate = useCallback(
    async ({ onSuccess, onError }: ValidateProps<T>) => {
      const isSuccess = await trigger();

      if (isSuccess) {
        onSuccess(getValues());
        return;
      }

      if (onError) {
        onError(formState.errors);
        return;
      }
    },
    [trigger, getValues, formState.errors],
  );

  const asArray = useCallback(
    <N extends ArrayPath<Schema<T>>>(name: N) => {
      const { fields, ...rest } = useFieldArray({
        control: form.control,
        name,
        keyName: "uuid",
      });

      const currentFields = (
        fields.length
          ? fields
          : defaultValues &&
              typeof defaultValues === "object" &&
              !Array.isArray(defaultValues) &&
              name in (defaultValues as Record<string, unknown>)
            ? (defaultValues as Record<string, unknown>)[name]
            : []
      ) as FieldArrayWithId<Schema<T>, N, "uuid">[];

      return {
        ...rest,
        [name]: currentFields,
      } as Omit<UseFieldArrayReturn<Schema<T>, N, "uuid">, "fields"> & {
        [K in N]: FieldArrayWithId<Schema<T>, N, "uuid">[];
      };
    },
    [defaultValues],
  );

  return {
    ...{
      ...form,
      formState,
    },
    validate,
    asArray,
  };
};
