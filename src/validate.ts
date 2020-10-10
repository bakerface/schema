function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export class SchemaValidationError extends Error {
  public readonly status = 400;
  public readonly name = "SchemaValidationError";

  constructor(
    public readonly path: string,
    public readonly schema: unknown,
    public readonly value: unknown,
    public readonly message: string
  ) {
    super();
  }
}

function dot(path: string, name: string) {
  const accessor = /\s/.test(name) ? `["${name}"]` : `.${name}`;
  return path + accessor;
}

export function validate(
  path: string,
  schema: unknown,
  value: unknown
): SchemaValidationError[] {
  const errors: SchemaValidationError[] = [];
  validateRecursive(path, schema, value, errors);
  return errors;
}

function validateRecursive(
  path: string,
  schema: unknown,
  value: unknown,
  errors: SchemaValidationError[]
): void {
  if (!isRecord(schema)) {
    errors.push(
      new SchemaValidationError(
        path,
        schema,
        value,
        "A schema must be an object"
      )
    );

    return;
  }

  if (typeof schema.type !== "string") {
    errors.push(
      new SchemaValidationError(
        path,
        schema,
        value,
        "A schema must have a type"
      )
    );

    return;
  }

  if (schema.type === "any") {
    return;
  }

  if (schema.type === "arrayOf") {
    if (!Array.isArray(value)) {
      errors.push(
        new SchemaValidationError(
          path,
          schema,
          value,
          "Expected the value to be an array"
        )
      );

      return;
    }

    for (let i = 0, ii = value.length; i < ii; i++) {
      validateRecursive(`${path}[${i}]`, schema.payload, value[i], errors);
    }

    return;
  }

  if (schema.type === "boolean") {
    if (typeof value !== "boolean") {
      errors.push(
        new SchemaValidationError(
          path,
          schema,
          value,
          "Expected the value to be a boolean"
        )
      );
    }

    return;
  }

  if (schema.type === "constant") {
    if (value !== schema.payload) {
      errors.push(
        new SchemaValidationError(
          path,
          schema,
          value,
          `Expected the value to be ${JSON.stringify(schema.payload)}`
        )
      );
    }

    return;
  }

  if (schema.type === "number") {
    if (typeof value !== "number") {
      errors.push(
        new SchemaValidationError(
          path,
          schema,
          value,
          "Expected the value to be a number"
        )
      );
    }

    return;
  }

  if (schema.type === "oneOf") {
    if (!Array.isArray(schema.payload)) {
      errors.push(
        new SchemaValidationError(
          path,
          schema,
          value,
          "A oneOf schema must specify an array of schemas"
        )
      );

      return;
    }

    for (const subschema of schema.payload) {
      const e: SchemaValidationError[] = [];
      validateRecursive(path, subschema, value, e);

      if (e.length === 0) {
        return;
      }
    }

    errors.push(
      new SchemaValidationError(
        path,
        schema,
        value,
        "Expected the value to match one of the schemas"
      )
    );

    return;
  }

  if (schema.type === "optional") {
    if (typeof value !== "undefined") {
      validateRecursive(path, schema.payload, value, errors);
    }

    return;
  }

  if (schema.type === "recordOf") {
    if (!isRecord(value)) {
      errors.push(
        new SchemaValidationError(
          path,
          schema,
          value,
          "Expected the value to be an object"
        )
      );

      return;
    }

    for (const name of Object.getOwnPropertyNames(value)) {
      validateRecursive(dot(path, name), schema.payload, value[name], errors);
    }

    return;
  }

  if (schema.type === "shape") {
    if (!isRecord(schema.payload)) {
      errors.push(
        new SchemaValidationError(
          path,
          schema,
          value,
          "A shape schema must specify a shape object"
        )
      );

      return;
    }

    if (!isRecord(value)) {
      errors.push(
        new SchemaValidationError(
          path,
          schema,
          value,
          "Expected the value to be an object"
        )
      );

      return;
    }

    for (const name of Object.getOwnPropertyNames(schema.payload)) {
      validateRecursive(
        dot(path, name),
        schema.payload[name],
        value[name],
        errors
      );
    }

    return;
  }

  if (schema.type === "string") {
    if (typeof value !== "string") {
      errors.push(
        new SchemaValidationError(
          path,
          schema,
          value,
          "Expected the value to be a string"
        )
      );
    }

    return;
  }

  errors.push(
    new SchemaValidationError(path, schema, value, "Unknown schema type")
  );
}
