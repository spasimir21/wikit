const $IS_TYPE = Symbol('$IS_TYPE');

// prettier-ignore
type MapType<T> = 
    T extends StringConstructor ? string 
  : T extends NumberConstructor ? number
  : T extends BigIntConstructor ? bigint
  : T extends BooleanConstructor ? boolean
  : T extends TypeObject<infer R> ? R
  : T extends new (...args: any) => any ? InstanceType<T>
  : T extends Record<any, any> ? { [Key in keyof T]: MapType<T[Key]>; }
  : T;

interface UnmarkedTypeObject<T = any> {
  default?(): T;
  validate?(value: any): boolean;
  [$IS_TYPE]?: true;
}

interface TypeObject<T = any> extends UnmarkedTypeObject<T> {
  [$IS_TYPE]: true;
}

function isTypeObject(value: any): value is TypeObject {
  if (typeof value !== 'object' || value == null) return false;
  return $IS_TYPE in value;
}

function markType(value: UnmarkedTypeObject): void {
  value[$IS_TYPE] = true;
}

function makeType<T>(value: UnmarkedTypeObject<T>): TypeObject<T> {
  markType(value);
  return value as TypeObject<T>;
}

export { $IS_TYPE, UnmarkedTypeObject, TypeObject, MapType, isTypeObject, markType, makeType };
