import { CreateWikit, Wikit } from '@wikit/database';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { Injectable } from '@nestjs/common';

@Injectable()
class DataService {
  constructor(private readonly database: DatabaseConnection) {}

  async createWikit(uuid: string, title: string, text: string): Promise<string> {
    const wikit = Wikit.create({ title });

    await this.database.run(CreateWikit, { uuid, wikit });

    return wikit.uuid;
  }
}

export { DataService };
