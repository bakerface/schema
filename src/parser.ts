import type { TypeOf } from "./type-of";
import { SchemaValidationError, validate } from "./validate";

export class SchemaParseError extends Error {
  public readonly status = 400;
  public readonly name = "SchemaParseError";

  constructor(
    public readonly path: string,
    public readonly schema: unknown,
    public readonly value: unknown,
    public readonly errors: SchemaValidationError[]
  ) {
    super();

    this.message = [
      `Attempt to parse ${path} resulted in the following errors:`,
      ...errors.map((err) => `${err.path}: ${err.message}`),
    ].join("\n");
  }
}

export type Parse<T> = (name: string, value: unknown) => T;

export function parser<Schema>(schema: Schema): Parse<TypeOf<Schema>> {
  return (path: string, value: unknown): TypeOf<Schema> => {
    const errors = validate(path, schema, value);

    if (errors.length > 0) {
      throw new SchemaParseError(path, schema, value, errors);
    }

    return value as TypeOf<Schema>;
  };
}
