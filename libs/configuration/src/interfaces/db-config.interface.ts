type ConnectionOptionsType =
  | 'mysql'
  | 'mariadb'
  | 'postgres'
  | 'cockroachdb'
  | 'sqlite'
  | 'mssql'
  | 'sap'
  | 'oracle'
  | 'cordova'
  | 'nativescript'
  | 'react-native'
  | 'sqljs'
  | 'mongodb'
  | 'aurora-data-api'
  | 'aurora-data-api-pg'
  | 'expo'
  | 'better-sqlite3'
  | 'capacitor';

interface SslDataInterface {
  readonly ca: string;
  readonly key: string;
  readonly cert: string;
}

export interface DbConfigInterface {
  readonly type: ConnectionOptionsType;
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly username: string;
  readonly password: string;
  readonly synchronize: boolean;
  readonly sslOn?: boolean;
  readonly ssl?: SslDataInterface;
}
