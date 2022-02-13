import { isTypeObject, MapType } from './type';

function _default<T extends any>(type: T): MapType<T> {
  if (type === String) return '' as any;
  if (type === Number) return 0 as any;
  if (type === BigInt) return BigInt(0) as any;
  if (type === Boolean) return false as any;

  if (isTypeObject(type)) return type.default ? type.default() : undefined;
  if (typeof type === 'function') return undefined as any;

  if (typeof type !== 'object' || type == null) return type as any;

  const object: any = {};

  for (const key in type) {
    object[key] = _default(type[key]);
  }

  return object;
}

function validate<T extends any>(type: T, value: any): value is MapType<T> {
  if (type === String) return typeof value === 'string';
  if (type === Number) return typeof value === 'number';
  if (type === BigInt) return typeof value === 'bigint';
  if (type === Boolean) return typeof value === 'boolean';

  if (isTypeObject(type)) return type.validate ? type.validate(value) : true;
  if (typeof type === 'function') return value instanceof type;

  if (typeof type !== 'object' || type == null) return value === type;
  if (typeof value !== 'object' || value == null) return false;

  for (const key in type) {
    if (!validate(type[key], value[key])) return false;
  }

  return true;
}

export { _default as default, validate };
