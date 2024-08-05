import { z, type ZodArray, type ZodObject, type ZodRawShape } from "zod";

export const asArray = <T extends ZodRawShape, K extends string>(
  schema: ZodObject<T>,
  key: K,
) =>
  z.object({
    [key as K]: z.array(schema),
  }) as unknown as ZodObject<{ [P in K]: ZodArray<ZodObject<T>> }>;
