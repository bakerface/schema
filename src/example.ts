import * as Schema from ".";

export type User = Schema.TypeOf<typeof User>;

export const User = Schema.shape({
  id: Schema.string,
  username: Schema.string,
  age: Schema.number,
  bio: Schema.optional(Schema.string),
  interests: Schema.arrayOf(Schema.string),
  permissions: Schema.recordOf(Schema.boolean),
  role: Schema.oneOf([
    Schema.constant("guest"),
    Schema.constant("moderator"),
    Schema.constant("admin"),
  ]),
});

export const parseUser = Schema.parser(User);
export const isUser = Schema.guard(User);

const user = {};

// simple type guards
if (isUser(user)) {
  console.log(user.permissions.canCreateArticle);
}

// simple parsing
const john = parseUser("john", user);

// SchemaParseError: Attempt to parse john resulted in the following errors:
// john.id: Expected the value to be a string
// john.username: Expected the value to be a string
// john.age: Expected the value to be a number
// john.interests: Expected the value to be an array
// john.permissions: Expected the value to be an object
// john.role: Expected the value to match one of the schemas

console.log(john.interests.length);
