import { MatchWikit, CreateWikit, Wikit } from '@wikit/database';
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

  async createWikit(uuid: string, title: string, text: string, parents: string[], children: string[]): Promise<string> {
    if (title.length < 3 || title.length > 100) throw new Error('Title too long or too short!');
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
