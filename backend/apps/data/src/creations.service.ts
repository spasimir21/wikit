import { CreationType } from './model/creationType.enum';
import { CreationDTO } from './model/creation.model';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { GetCreations } from '@wikit/database';
import { Injectable } from '@nestjs/common';

@Injectable()
class CreationsService {
  constructor(private readonly database: DatabaseConnection) {}

  async getCreations(uuid: string): Promise<CreationDTO[]> {
    const creationsResult = await this.database.run(GetCreations, { uuid });

    return creationsResult.records.map(record => ({
      type: record.type.toUpperCase() as CreationType,
      uuid: record.uuid
    }));
  }
}

export { CreationsService };
