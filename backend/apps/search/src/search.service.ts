import { GetImagesForWikits, SearchImagesForWikits, SearchRootText, SearchSubTexts, SearchTextForWikit } from '@wikit/database';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { TextDTO } from './model/text.model';
import { Injectable } from '@nestjs/common';

const IMAGE_RATING_BIAS = 1;

@Injectable()
class SearchService {
  constructor(private readonly database: DatabaseConnection) {}

  async searchRootText(query: string, target_text_difficulty: number): Promise<TextDTO | null> {
    const searchResult = await this.database.run(SearchRootText, {
      query,
      target_text_difficulty: (target_text_difficulty - 1) / 4
    });
    if (searchResult.records.length == 0) return null;
    const result = searchResult.records[0];
    return { query, target_text_difficulty, text: result.text.uuid, wikit: result.wikit.uuid };
  }

  async searchTextForWikit(wikit: string, query: string, target_text_difficulty: number): Promise<TextDTO | null> {
    const searchResult = await this.database.run(SearchTextForWikit, {
      wikit,
      query,
      target_text_difficulty: (target_text_difficulty - 1) / 4
    });
    if (searchResult.records.length == 0) return null;
    const result = searchResult.records[0];
    return { query, target_text_difficulty, text: result.text.uuid, wikit };
  }

  async searchSubTexts(parent: string, query: string, target_text_difficulty: number): Promise<TextDTO[]> {
    const searchResult = await this.database.run(SearchSubTexts, {
      parent,
      query,
      target_text_difficulty: (target_text_difficulty - 1) / 4
    });

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
        query,
        target_text_difficulty
      };
    });

    return texts.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  async searchImages(query: string, wikits: string[]): Promise<Record<string, string>> {
    const imageSearchResult = await this.database.run(SearchImagesForWikits, { query, wikits });
    const imageRatingsResult = await this.database.run(GetImagesForWikits, { wikits });

    const imageScores: Record<string, number> = {} as any;

    for (const record of imageRatingsResult.records) {
      imageScores[record.image] = record.rating * IMAGE_RATING_BIAS;
    }

    for (const record of imageSearchResult.records) {
      imageScores[record.image] += record.score;
    }

    const bestImageForWikit: Record<string, string> = {};

    for (const record of imageRatingsResult.records) {
      if (bestImageForWikit[record.wikit] == null) {
        bestImageForWikit[record.wikit] = record.image;
        continue;
      }

      if (imageScores[record.image] > imageScores[bestImageForWikit[record.wikit]])
        bestImageForWikit[record.wikit] = record.image;
    }

    return bestImageForWikit;
  }
}

export { SearchService };
