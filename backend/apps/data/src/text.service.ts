import { CreateText, Text, MatchText, MatchTexts } from '@wikit/database';
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
      wikit_id: wikit.uuid,
      wikit_title: wikit.title,
      text: text.text,
      rating: text.rating * 4 + 1,
      difficulty: Math.round(text.difficulty * 4 + 1),
      created_by: { uuid: user.uuid, username: user.username }
    };
  }

  async getTexts(uuids: string[]): Promise<TextDTO[]> {
    const result = await this.database.run(MatchTexts, { uuids });
    return result.records.map(({ text, user, wikit }) => ({
      uuid: text.uuid,
      wikit_id: wikit.uuid,
      wikit_title: wikit.title,
      text: text.text,
      rating: text.rating * 4 + 1,
      difficulty: Math.round(text.difficulty * 4 + 1),
      created_by: { uuid: user.uuid, username: user.username }
    }));
  }

  async createText(uuid: string, wikit: string, textContent: string, difficulty: number): Promise<string | null> {
    if (textContent.length < 10 || textContent.length > 2000) throw new Error('Text too long or too short!');
    if (difficulty < 1 || difficulty > 5) throw new Error('Text difficulty must be between 1 and 5!');

    const text = Text.create({ text: textContent, difficulty: (difficulty - 1) / 4 });

    const result = await this.database.run(CreateText, { uuid, wikit, text });
    if (result.records.length == 0) return null;

    return text.uuid;
  }
}

export { TextService };
