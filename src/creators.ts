export interface AnySchema {
  readonly type: "any";
}

export const any: AnySchema = { type: "any" };

export interface ArrayOfSchema<T> {
  readonly type: "arrayOf";
  readonly payload: T;
}

export function arrayOf<T>(payload: T): ArrayOfSchema<T> {
  return { type: "arrayOf", payload };
}

export interface BooleanSchema {
  readonly type: "boolean";
}

export const boolean: BooleanSchema = { type: "boolean" };

export interface ConstantSchema<T> {
  readonly type: "constant";
  readonly payload: T;
}

export function constant<T extends boolean>(payload: T): ConstantSchema<T>;
export function constant<T extends null>(payload: T): ConstantSchema<T>;
export function constant<T extends number>(payload: T): ConstantSchema<T>;
export function constant<T extends string>(payload: T): ConstantSchema<T>;
export function constant<T>(payload: T): ConstantSchema<T> {
  return { type: "constant", payload };
}

export interface NumberSchema {
  readonly type: "number";
}

export const number: NumberSchema = { type: "number" };

export interface OneOfSchema<T> {
  readonly type: "oneOf";
  readonly payload: T[];
}

export function oneOf<T>(payload: T[]): OneOfSchema<T> {
  return { type: "oneOf", payload };
}

export interface OptionalSchema<T> {
  readonly type: "optional";
  readonly payload: T;
}

export function optional<T>(payload: T): OptionalSchema<T> {
  return { type: "optional", payload };
}

export interface RecordOfSchema<T> {
  readonly type: "recordOf";
  readonly payload: T;
}

export function recordOf<T>(payload: T): RecordOfSchema<T> {
  return { type: "recordOf", payload };
}

export interface ShapeSchema<T> {
  readonly type: "shape";
  readonly payload: T;
}

export function shape<T>(payload: T): ShapeSchema<T> {
  return { type: "shape", payload };
}

export interface StringSchema {
  readonly type: "string";
}

export const string: StringSchema = { type: "string" };
