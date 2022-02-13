import { makeType, MapType } from './type';
import * as typesystem from './typesystem';
import * as uuid from 'uuid';

function Range(min: number, max: number = Infinity) {
  return makeType<number>({
    default: () => min,
    validate: value => typeof value === 'number' && min <= value && value <= max
  });
}

function IntRange(min: number, max: number = Infinity) {
  return makeType<number>({
    default: () => min,
    validate: value => typeof value === 'number' && value % 1 == 0 && min <= value && value <= max
  });
}

function Nullable<T>(type: T) {
  return makeType<MapType<T | null>>({
    default: () => null,
    validate: value => value === null || typesystem.validate(type, value)
  });
}

const Integer = makeType<number>({
  default: () => 0,
  validate: value => typeof value === 'number' && value % 1 == 0
});

const UUID = makeType<string>({
  default: uuid.v4,
  validate: uuid.validate
});

const Any = makeType<any>({
  validate: () => true
});

export { Range, IntRange, Nullable, Integer, UUID, Any };
