import type { NextRequest } from "next/server";

type Primitive = string | number | boolean | bigint | symbol | undefined | null;

type Builtin = Date | Error | RegExp;

export type NullableProperties<T, K extends keyof T | undefined = undefined> = [
  K,
] extends [keyof T]
  ? T extends object
    ? Omit<T, K> & { [P in K]: NullableProperties<T[P]> | null }
    : T
  : T extends Primitive | Builtin
    ? T | null
    : T extends Array<infer U>
      ? Array<NullableProperties<U>> | null
      : T extends object
        ? { [P in keyof T]?: NullableProperties<T[P]> | null }
        : T | null;

export type RequiredProperties<T, K extends keyof T | undefined = undefined> = [
  K,
] extends [keyof T]
  ? T extends object
    ? Omit<T, K> & { [P in K]-?: RequiredProperties<NonNullable<T[P]>> }
    : T
  : T extends Primitive | Builtin
    ? NonNullable<T>
    : T extends Array<infer U>
      ? Array<RequiredProperties<U>>
      : T extends object
        ? { [P in keyof T]-?: RequiredProperties<NonNullable<T[P]>> }
        : NonNullable<T>;

export type ErrorsFor<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? ErrorsFor<U>[]
    : T[K] extends object
      ? ErrorsFor<T[K]>
      : T[K] extends Array<infer U>
        ? ErrorsFor<U>[]
        : T[K] | undefined;
};

export interface Request<QueryParameters extends string = string>
  extends Omit<NextRequest, "nextUrl"> {
  nextUrl: {
    searchParams: Omit<URLSearchParams, "has" | "get" | "getAll"> & {
      has(name: QueryParameters): boolean;
      get(name: QueryParameters): string | null;
      getAll(name: QueryParameters): string[];
    };
  };
}

export interface RequestPath<T> {
  params: Partial<T>;
}
