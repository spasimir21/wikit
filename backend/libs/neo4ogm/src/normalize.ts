import { Node, Relationship, Path } from 'neo4j-driver-core';
import { DatabaseConnection } from './database';

function normalizeNode(node: Node, database: DatabaseConnection): any {
  const data = { _id: node.identity, ...normalize(node.properties, database) };
  return node.labels.length > 0 ? database.models[node.labels[0]].create(data) : data;
}

function normalizeRelationship(relationship: Relationship, database: DatabaseConnection): any {
  const data = {
    _id: relationship.identity,
    _from: relationship.start,
    _to: relationship.end,
    ...normalize(relationship.properties, database)
  };

  return database.relationships[relationship.type].create(data);
}

function normalizePath(path: Path, database: DatabaseConnection): any {
  return {
    start: normalizeNode(path.start, database),
    end: normalizeNode(path.end, database),
    segments: path.segments.map(segment => ({
      start: normalizeNode(segment.start, database),
      relationship: normalizeRelationship(segment.relationship, database),
      end: normalizeNode(segment.end, database)
    })),
    length: path.length
  };
}

function normalize(value: any, database: DatabaseConnection): any {
  if (typeof value !== 'object' || value == null) return value;

  if (value instanceof Relationship) return normalizeRelationship(value, database);
  if (value instanceof Node) return normalizeNode(value, database);
  if (value instanceof Path) return normalizePath(value, database);

  const object: any = {};

  for (const key in value) {
    object[key] = typeof value[key] !== 'object' || value[key] == null ? value[key] : normalize(value[key], database);
  }

  return object;
}

export { normalize };
