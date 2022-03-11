import { SearchRootText, SearchSubTexts } from '@wikit/database';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { TextDTO } from './model/text.model';
import { Injectable } from '@nestjs/common';

@Injectable()
class SearchService {
  constructor(private readonly database: DatabaseConnection) {}

  async searchRootText(query: string): Promise<TextDTO | null> {
    const searchResult = await this.database.run(SearchRootText, { query });
    if (searchResult.records.length == 0) return null;
    const result = searchResult.records[0];
    return { query, text: result.text.uuid, wikit: result.wikit.uuid };
  }

  async searchSubTexts(parent: string, query: string): Promise<TextDTO[]> {
    const searchResult = await this.database.run(SearchSubTexts, { parent, query });

    const bestTextForWikit: Record<string, typeof searchResult['records'][number]> = {};

    for (const result of searchResult.records) {
      if (bestTextForWikit[result.wikit.uuid] == null || bestTextForWikit[result.wikit.uuid].score < result.score)
        bestTextForWikit[result.wikit.uuid] = result;
    }

    const texts = Object.values(bestTextForWikit).map(result => {
      return {
        score: result.score,
        text: result.text.uuid,
        wikit: result.wikit.uuid,
        relation: result.relatesTo.uuid,
        query
      };
    });

    return texts.sort((a, b) => b.score - a.score).slice(0, 5);
  }
}

export { SearchService };
