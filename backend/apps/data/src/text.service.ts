import { CreateText, Text, MatchText } from '@wikit/database';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { TextDTO } from './model/text.model';
import { Injectable } from '@nestjs/common';

@Injectable()
class TextService {
  constructor(private readonly database: DatabaseConnection) {}

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

  async createText(uuid: string, wikit: string, textContent: string): Promise<string | null> {
    if (textContent.length < 10 || textContent.length > 2000) throw new Error('Text too long or too short!');

    const text = Text.create({ text: textContent });

    const result = await this.database.run(CreateText, { uuid, wikit, text });

    return result.records.length == 0 ? null : text.uuid;
  }
}

export { TextService };
