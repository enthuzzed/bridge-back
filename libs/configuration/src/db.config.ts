import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from 'config';
import { readFileSync } from 'fs';
import { DbConfigInterface } from './interfaces';
import { ICPTransactionEntity, TransactionEntity } from "@app/entitie";

const DB_CONFIG: DbConfigInterface = config.get('core_db');

export const initialDbConfiguration: TypeOrmModuleOptions = {
  host: DB_CONFIG.host,
  port: DB_CONFIG.port,
  username: DB_CONFIG.username,
  password: DB_CONFIG.password,
  database: DB_CONFIG.database,
  logging: false,
  entities: [TransactionEntity, ICPTransactionEntity],
  synchronize: true,
  keepConnectionAlive: true,
  ssl: DB_CONFIG.sslOn
    ? {
        ca: readFileSync(DB_CONFIG.ssl!.ca, 'utf-8'),
        key: DB_CONFIG.ssl!.key
          ? readFileSync(DB_CONFIG.ssl!.key, 'utf-8')
          : null,
        cert: DB_CONFIG.ssl!.cert
          ? readFileSync(DB_CONFIG.ssl!.cert, 'utf-8')
          : null,
      }
    : null,
};

Object.assign(initialDbConfiguration, { type: DB_CONFIG.type });

export const dbConfiguration: TypeOrmModuleOptions = {
  host: DB_CONFIG.host,
  port: DB_CONFIG.port,
  username: DB_CONFIG.username,
  password: DB_CONFIG.password,
  database: DB_CONFIG.database,
  logging: false,
  entities: [TransactionEntity, ICPTransactionEntity],
  synchronize: DB_CONFIG.synchronize,
  keepConnectionAlive: true,
  ssl: DB_CONFIG.sslOn
    ? {
        ca: readFileSync(DB_CONFIG.ssl!.ca, 'utf-8'),
        key: DB_CONFIG.ssl!.key
          ? readFileSync(DB_CONFIG.ssl!.key, 'utf-8')
          : null,
        cert: DB_CONFIG.ssl!.cert
          ? readFileSync(DB_CONFIG.ssl!.cert, 'utf-8')
          : null,
      }
    : null,
};

Object.assign(dbConfiguration, { type: DB_CONFIG.type });
