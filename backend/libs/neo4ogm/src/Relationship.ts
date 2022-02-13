import { markType, MapType, TypeObject } from './typesystem/type';
import * as typesystem from './typesystem/typesystem';
import { Nullable } from './typesystem/types';

const $RELATIONSHIP = Symbol('$RELATIONSHIP');

type Relationship<TName extends string = any, TSchema = any> = {
  name: TName;
  schema: TSchema;
  create: (data?: Partial<MapType<TSchema>>) => MapType<TSchema>;
  toString(): TName;
} & { [Key in keyof TSchema]: TSchema[Key] } & Required<TypeObject<MapType<TSchema>>>;

function Relationship<TName extends string, TSchema>(
  name: TName,
  _from: any[], // 'any' because of typescript limitations
  _to: any[], // 'any' because of typescript limitations
  schema: TSchema = {} as any
): Relationship<TName, TSchema & { _id: bigint | null; _from: bigint | null; _to: bigint | null }> {
  schema = { ...schema, _id: Nullable(BigInt), _from: Nullable(BigInt), _to: Nullable(BigInt) } as any;

  const relationship = {
    name,
    schema,
    create: (data?: any) => Object.assign(typesystem.default(schema), data, { [$RELATIONSHIP]: relationship }),
    default: () => Object.assign(typesystem.default(schema), { [$RELATIONSHIP]: relationship }),
    validate: (data: any) => typesystem.validate(schema, data),
    toString: () => name,
    ...schema
  };

  markType(relationship);

  return relationship as any;
}

function getRelationship(node: any): Relationship {
  return node[$RELATIONSHIP];
}

export { Relationship, getRelationship };
