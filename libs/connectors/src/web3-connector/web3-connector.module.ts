import { DynamicModule, Module } from '@nestjs/common';
import Web3 from 'web3';
import net from 'net';
import { HttpProvider, IpcProvider, WebsocketProvider } from 'web3-core';
import { Web3ConnectionTypeEnum } from './enums';
import { PolygonBridgeContract } from './polygon-bridge.contract';
import { WEB3_PROVIDER } from '@app/constants';
import { Web3ConnectorConfigInterface } from './interfaces';
import { PolygonTokenContract } from '@app/connectors/web3-connector/polygon-token.contract';

@Module({})
export class Web3ConnectorModule {
  static forRoot(config: Web3ConnectorConfigInterface): DynamicModule {
    const { url, connectionType } = config;

    let web3Provider: HttpProvider | WebsocketProvider | IpcProvider;

    switch (connectionType) {
      case Web3ConnectionTypeEnum.HTTP:
        web3Provider = new Web3.providers.HttpProvider(url, {
          keepAlive: true,
        });
        break;
      case Web3ConnectionTypeEnum.WSS:
        web3Provider = new Web3.providers.WebsocketProvider(url, {
          reconnect: {
            auto: true,
            delay: 5000,
            maxAttempts: 1000,
            onTimeout: false,
          },
          clientConfig: {
            keepalive: true,
            keepaliveInterval: 30000,
          },
        });
        break;
      case Web3ConnectionTypeEnum.IPC:
        web3Provider = new Web3.providers.IpcProvider(url, net);
        break;
      default:
        throw new Error('Unsupported connection type');
    }

    return {
      module: Web3ConnectorModule,
      providers: [
        {
          provide: WEB3_PROVIDER,
          useFactory: () => new Web3(web3Provider),
        },
        PolygonBridgeContract,
        PolygonTokenContract,
      ],
      exports: [WEB3_PROVIDER, PolygonBridgeContract, PolygonTokenContract],
    };
  }
}
