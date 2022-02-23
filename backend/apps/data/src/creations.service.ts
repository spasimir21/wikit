import { CreatedRelations, CreatedTexts, CreatedWikits } from '@wikit/database';
import { CreationsDTO } from './model/creations.model';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { Injectable } from '@nestjs/common';

@Injectable()
class CreationsService {
  constructor(private readonly database: DatabaseConnection) {}

  async getCreations(uuid: string): Promise<CreationsDTO> {
    const wikits = await this.database.run(CreatedWikits, { uuid });
    const texts = await this.database.run(CreatedTexts, { uuid });
    const relations = await this.database.run(CreatedRelations, { uuid });

    return {
      wikits: wikits.records.map(record => record.wikit),
      texts: texts.records.map(record => record.text),
      relations: relations.records.map(record => record.relation)
    };
  }
}

export { CreationsService };
