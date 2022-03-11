import { MatchWikit, CreateWikit, Wikit, FindWikits, MatchWikits } from '@wikit/database';
import { WikitStatsDTO } from './model/wikit-stats.model';
import { RelationService } from './relation.service';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { WikitDTO } from './model/wikit.model';
import { TextService } from './text.service';
import { Injectable } from '@nestjs/common';

@Injectable()
class WikitService {
  constructor(
    private readonly database: DatabaseConnection,
    private readonly textService: TextService,
    private readonly relationService: RelationService
  ) {}

  async getWikit(uuid: string): Promise<WikitDTO | null> {
    const result = await this.database.run(MatchWikit, { uuid });
    if (result.records.length == 0) return null;
    const { wikit, user } = result.records[0];
    return { uuid: wikit.uuid, title: wikit.title, created_by: { uuid: user.uuid, username: user.username } };
  }

  async getWikits(uuids: string[]): Promise<WikitDTO[]> {
    const result = await this.database.run(MatchWikits, { uuids });
    return result.records.map(({ wikit, user }) => ({
      uuid: wikit.uuid,
      title: wikit.title,
      created_by: { uuid: user.uuid, username: user.username }
    }));
  }

  async findWikits(title: string): Promise<WikitStatsDTO[]> {
    const result = await this.database.run(FindWikits, { title });
    return result.records.map(record => ({
      uuid: record.wikit,
      textCount: Number(record.text_count),
      averageRating: record.average_rating
    }));
  }

  async createWikit(uuid: string, title: string, text: string, parents: string[], children: string[]): Promise<string> {
    if (title.length < 3 || title.length > 100) throw new Error('Title too long or too short!');
    if (text.length < 10 || text.length > 2000) throw new Error('Text too long or too short!');
    if (children.length > 10) throw new Error('Too many children!');
    if (parents.length > 5) throw new Error('Too many parents!');

    const wikit = Wikit.create({ title });

    await this.database.run(CreateWikit, { uuid, wikit });
    await this.textService.createText(uuid, wikit.uuid, text);

    for (const parent of parents) {
      await this.relationService.createRelation(uuid, parent, wikit.uuid);
    }

    for (const child of children) {
      await this.relationService.createRelation(uuid, wikit.uuid, child);
    }

    return wikit.uuid;
  }
}

export { WikitService };
