import { SearchHit } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { Client as ElasticClient } from '@elastic/elasticsearch';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { Inject, Injectable } from '@nestjs/common';
import { GetChildRelations } from '@wikit/database';
import { Config, CONFIG } from '@wikit/config';
import { TextDTO } from './model/text.model';

@Injectable()
class SearchService {
  constructor(
    @Inject(CONFIG) private readonly config: Config,
    private readonly database: DatabaseConnection,
    private readonly elastic: ElasticClient
  ) {}

  async searchRootText(query: string): Promise<TextDTO | null> {
    const result = await this.elastic.search({
      index: this.config.elasticsearch.index,
      query: {
        bool: {
          must: [{ match: { text: query } }],
          should: [{ rank_feature: { field: 'rating', linear: {} } }]
        }
      },
      fields: ['wikit', 'rating'],
      _source: false
    });

    if (result.hits.hits.length == 0) return null;

    const text = result.hits.hits[0];
    return { query, wikit: text.fields.wikit[0], text: text._id };
  }

  async searchSubTexts(parent: string, query: string): Promise<TextDTO[]> {
    const relationsResult = await this.database.run(GetChildRelations, { parent });
    const relations = relationsResult.records.map(record => record.relation);

    // prettier-ignore
    const searchResult = await this.elastic.search({
      index: this.config.elasticsearch.index,
      query: {
        bool: {
          must: [
            { terms: { wikit: relations.map(relation => relation.child) } },
            { match: { text: query } }
          ],
          should: [{ rank_feature: { field: 'rating', linear: {} } }]
        }
      },
      fields: ['wikit', 'rating'],
      _source: false
    });

    const bestTextForWikit: Record<string, SearchHit> = {};

    for (const text of searchResult.hits.hits) {
      if (bestTextForWikit[text.fields.wikit] == null || bestTextForWikit[text.fields.wikit]._score < text._score)
        bestTextForWikit[text.fields.wikit] = text;
    }

    const texts = Object.values(bestTextForWikit).map(text => {
      const relation = relations.find(relation => relation.child === text.fields.wikit[0]);

      return {
        score: text._score * relation.rating,
        text: text._id,
        wikit: text.fields.wikit[0],
        relation: relation.uuid,
        query
      };
    });

    return texts.sort((a, b) => b.score - a.score).slice(0, 5);
  }
}

export { SearchService };
