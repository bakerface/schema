import type { TypeOf } from "./type-of";
import { validate } from "./validate";

export type Guard<T> = (value: unknown) => value is T;

export function guard<Schema>(schema: Schema): Guard<TypeOf<Schema>> {
  return (value: unknown): value is TypeOf<Schema> => {
    return validate("", schema, value).length === 0;
  };
}
