import neo4j, { AuthToken, Config as Neo4JDriverConfig, Driver as Neo4JDriver } from 'neo4j-driver';
import { ResultSummary, TransactionConfig } from 'neo4j-driver-core';
import * as typesystem from './typesystem/typesystem';
import { Relationship } from './Relationship';
import { MapType } from './typesystem/type';
import { normalize } from './normalize';
import { Model } from './Model';
import { Query } from './Query';

class DatabaseConnection {
  public readonly relationships: Record<string, Relationship> = {};
  public readonly models: Record<string, Model> = {};
  private readonly driver: Neo4JDriver;

  constructor(
    url: string,
    auth: AuthToken | undefined,
    models: Model[],
    relationships: Relationship[],
    config?: Neo4JDriverConfig
  ) {
    this.driver = neo4j.driver(url, auth, { ...(config || {}), useBigInt: true });

    for (const model of models) {
      this.models[model.name] = model;
    }

    for (const relationship of relationships) {
      this.relationships[relationship.name] = relationship;
    }
  }

  async run<TParams, TResult>(
    query: Query<TParams, TResult>,
    params?: MapType<TParams>,
    sessionConfig?: Parameters<Neo4JDriver['session']>[0],
    transactionConfig?: TransactionConfig
  ): Promise<{ records: MapType<TResult>[]; summary: ResultSummary<bigint> }> {
    if (!typesystem.validate(query.params, params || {})) throw new Error(`Invalid Query Parameters!`);
    const result = await this.runRaw(query.cypher, params, sessionConfig, transactionConfig);

    return {
      records: result.records.map(record => normalize(record.toObject(), this)),
      summary: result.summary as any
    };
  }

  async runRaw(
    cypher: string,
    params?: any,
    sessionConfig?: Parameters<Neo4JDriver['session']>[0],
    transactionConfig?: TransactionConfig
  ) {
    const session = this.driver.session(sessionConfig);

    try {
      return await session.run(cypher, params, transactionConfig);
    } finally {
      await session.close();
    }
  }

  close(): Promise<void> {
    return this.driver.close();
  }
}

function connect(
  url: string,
  auth: AuthToken | undefined,
  models: Model[],
  relationships: Relationship[],
  config?: Neo4JDriverConfig
): DatabaseConnection {
  const connection = new DatabaseConnection(url, auth, models, relationships, config);
  return connection;
}

export { connect, DatabaseConnection };
