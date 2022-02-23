import { Relation, CreateRelation, MatchRelation, RelationExists } from '@wikit/database';
import { RelationDTO } from './model/relation.model';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { Injectable } from '@nestjs/common';

@Injectable()
class RelationService {
  constructor(private readonly database: DatabaseConnection) {}

  async getRelation(uuid: string): Promise<RelationDTO | null> {
    const result = await this.database.run(MatchRelation, { uuid });
    if (result.records.length == 0) return null;
    const { relation, user } = result.records[0];
    return {
      uuid: relation.uuid,
      parent: relation.parent,
      child: relation.child,
      rating: relation.rating,
      created_by: { uuid: user.uuid, username: user.username }
    };
  }

  async createRelation(uuid: string, parent: string, child: string): Promise<string | null> {
    if (parent == child) throw new Error('Parent and child cannot be the same wikit!');

    const relation = Relation.create({ parent, child });

    const exists = await this.database.run(RelationExists, { parent, child });
    if (exists.records.length > 0) return null;

    const result = await this.database.run(CreateRelation, { uuid, parent, child, relation });

    return result.records.length == 0 ? null : relation.uuid;
  }
}

export { RelationService };
