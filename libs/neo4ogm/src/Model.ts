import { markType, MapType, TypeObject } from './typesystem/type';
import * as typesystem from './typesystem/typesystem';
import { Nullable } from './typesystem/types';

const $MODEL = Symbol('$MODEL');

type Model<TName extends string = any, TSchema = any> = {
  name: TName;
  schema: TSchema;
  create: (data?: Partial<MapType<TSchema>>) => MapType<TSchema>;
  toString(): TName;
} & { [Key in keyof TSchema]: TSchema[Key] } & Required<TypeObject<MapType<TSchema>>>;

function Model<TName extends string, TSchema>(
  name: TName,
  schema: TSchema,
  _relationships?: any[] // 'any' because of typescript limitations
): Model<TName, TSchema & { _id: bigint | null }> {
  schema = { ...schema, _id: Nullable(BigInt) };

  const model = {
    name,
    schema,
    create: (data?: any) => Object.assign(typesystem.default(schema), data, { [$MODEL]: model }),
    default: () => Object.assign(typesystem.default(schema), { [$MODEL]: model }),
    validate: (data: any) => typesystem.validate(schema, data),
    toString: () => name,
    ...schema
  };

  markType(model);

  return model as any;
}

function getModel(node: any): Model {
  return node[$MODEL];
}

export { Model, getModel };
