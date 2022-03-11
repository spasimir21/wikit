import { Client as ElasticClient } from '@elastic/elasticsearch';
import { CreateText, Text, MatchText, MatchTexts } from '@wikit/database';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { Inject, Injectable } from '@nestjs/common';
import { Config, CONFIG } from '@wikit/config';
import { TextDTO } from './model/text.model';

@Injectable()
class TextService {
  constructor(
    @Inject(CONFIG) private readonly config: Config,
    private readonly database: DatabaseConnection,
    private readonly elastic: ElasticClient
  ) {}

  async getText(uuid: string): Promise<TextDTO | null> {
    const result = await this.database.run(MatchText, { uuid });
    if (result.records.length == 0) return null;
    const { text, user, wikit } = result.records[0];
    return {
      uuid: text.uuid,
      wikit: wikit.uuid,
      text: text.text,
      rating: text.rating,
      created_by: { uuid: user.uuid, username: user.username }
    };
  }

  async getTexts(uuids: string[]): Promise<TextDTO[]> {
    const result = await this.database.run(MatchTexts, { uuids });
    return result.records.map(({ text, user, wikit }) => ({
      uuid: text.uuid,
      wikit: wikit.uuid,
      text: text.text,
      rating: text.rating,
      created_by: { uuid: user.uuid, username: user.username }
    }));
  }

  async createText(uuid: string, wikit: string, textContent: string): Promise<string | null> {
    if (textContent.length < 10 || textContent.length > 2000) throw new Error('Text too long or too short!');

    const text = Text.create({ text: textContent });

    const result = await this.database.run(CreateText, { uuid, wikit, text });
    if (result.records.length == 0) return null;

    await this.elastic.create({
      index: this.config.elasticsearch.index,
      id: text.uuid,
      document: {
        wikit,
        rating: 1,
        text: textContent
      }
    });

    return text.uuid;
  }
}

export { TextService };
