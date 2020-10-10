import type {
  AnySchema,
  ArrayOfSchema,
  BooleanSchema,
  ConstantSchema,
  NumberSchema,
  OneOfSchema,
  OptionalSchema,
  RecordOfSchema,
  ShapeSchema,
  StringSchema,
} from "./creators";

type TypeOfRecursive<Schema> = Schema extends AnySchema
  ? unknown
  : Schema extends ArrayOfSchema<infer T>
  ? readonly TypeOf<T>[]
  : Schema extends BooleanSchema
  ? boolean
  : Schema extends ConstantSchema<infer T>
  ? T
  : Schema extends NumberSchema
  ? number
  : Schema extends RecordOfSchema<infer T>
  ? { readonly [key: string]: TypeOf<T> | undefined }
  : Schema extends ShapeSchema<infer T>
  ? { readonly [K in keyof T]: TypeOf<T[K]> }
  : Schema extends StringSchema
  ? string
  : Schema extends Record<string, unknown>
  ? "Error: Did you forget Schema.shape?"
  : "Error: Did you forget Schema.const?";

export type TypeOf<Schema> = Schema extends OneOfSchema<infer T>
  ? TypeOfRecursive<T>
  : Schema extends OptionalSchema<infer T>
  ? TypeOfRecursive<T> | undefined
  : TypeOfRecursive<Schema>;
