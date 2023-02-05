import { MatchWikit, CreateWikit, Wikit, MatchWikits, FindWikit, WikitExists } from '@wikit/database';
import { DatabaseConnection, DBObjectOf } from '@wikit/neo4ogm';
import { WikitStatsDTO } from './model/wikit-stats.model';
import { RelationService } from './relation.service';
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

  async findWikit(title: string): Promise<WikitStatsDTO | null> {
    const result = await this.database.run(FindWikit, { title });
    if (result.records.length == 0) return null;

    const record = result.records[0];
    return {
      uuid: record.wikit,
      title,
      textCount: Number(record.text_count),
      averageRating: record.average_rating * 4 + 1
    };
  }

  async createWikit(
    uuid: string,
    title: string,
    text: string,
    text_difficulty: number,
    parents: string[],
    children: string[]
  ): Promise<string> {
    if (text_difficulty < 1 || text_difficulty > 5) throw new Error('Text difficulty must be between 1 and 5!');
    if (title.length < 3 || title.length > 100) throw new Error('Title too long or too short!');
    if (text.length < 10 || text.length > 2000) throw new Error('Text too long or too short!');
    if (children.length > 10) throw new Error('Too many children!');
    if (parents.length > 5) throw new Error('Too many parents!');

    let wikit: DBObjectOf<typeof Wikit>;

    const wikitExistsResult = await this.database.run(WikitExists, { title });
    if (wikitExistsResult.records.length == 0) {
      wikit = Wikit.create({ title });
      await this.database.run(CreateWikit, { uuid, wikit });
    } else {
      wikit = wikitExistsResult.records[0].wikit;
    }

    await this.textService.createText(uuid, wikit.uuid, text, text_difficulty);

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
