import { DynamicModule, Module } from '@nestjs/common';
import { HttpAgent, SignIdentity } from '@dfinity/agent';
import { DfinityBridgeContract } from './dfinity-bridge.contract';
import { DFINITY_PROVIDER } from '@app/constants';
import { DfinityConfigInterface } from './interfaces';
import { DfinityTokenContract } from '@app/connectors/dfinity-connector/dfinity-token.contract';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { readFile } from 'fs/promises';

@Module({})
export class DfinityConnectorModule {
  static async forRoot(config: DfinityConfigInterface): Promise<DynamicModule> {
    const { url } = config;


    const pemfile = await readFile('./files/identity.pem', 'utf-8');

    const pem = pemfile
      .toString()
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace('\n', '')
      .trim();

    const raw = Buffer.from(pem, 'base64')
      .toString('hex')
      .replace('3053020101300506032b657004220420', '')
      .replace('a123032100', '');

    const key = new Uint8Array(Buffer.from(raw, 'hex'));

    const identity = Ed25519KeyIdentity.fromSecretKey(key);

    const dfinityAgentOption = { host: 'https://ic0.app', identity };

    return {
      module: DfinityConnectorModule,
      providers: [
        {
          provide: DFINITY_PROVIDER,
          useFactory: () => new HttpAgent(dfinityAgentOption),
        },
        DfinityBridgeContract,
        DfinityTokenContract,
      ],
      exports: [DFINITY_PROVIDER, DfinityBridgeContract, DfinityTokenContract],
    };
  }
}
