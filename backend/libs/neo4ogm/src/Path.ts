import { makeType, TypeObject, MapType } from './typesystem/type';
import { getModel } from './Model';

interface PathSegment<TStart, TEnd, TRelationship> {
  start: TStart;
  relationship: TRelationship;
  end: TEnd;
}

interface Path<TStart, TEnd, TMiddle, TRelationship> {
  start: TStart;
  end: TEnd;
  segments: PathSegment<TStart | TMiddle, TEnd | TMiddle, TRelationship>[];
  length: number;
}

type PathType<TStart, TEnd, TMiddle, TRelationship> = TypeObject<MapType<Path<TStart, TEnd, TMiddle, TRelationship>>>;

function Path<TStart, TEnd, TMiddle, TRelationship>(
  start: TStart[],
  end: TEnd[],
  _middle: TMiddle[],
  _relationship: TRelationship[]
): PathType<TStart, TEnd, TMiddle, TRelationship> {
  return makeType<any>({
    default: () => ({ start: getModel(start[0]).default(), end: getModel(end[0]).default(), segments: [], length: 0 })
  });
}

export { Path };
