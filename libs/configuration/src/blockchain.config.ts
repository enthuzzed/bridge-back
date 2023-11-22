import { ContractKey } from '@app/constants';
import config from 'config';
import {
  BlockchainConfigInterface,
  ContractsConfigInterface,
} from './interfaces';

export const blockchainConfig: BlockchainConfigInterface =
  config.get('blockchain');

export const contractsConfig: ContractsConfigInterface = {
  [ContractKey.PolygonBridge]: config.get('polygon_bridge'),
  [ContractKey.PolygonToken]: config.get('polygon_token'),
  [ContractKey.DfinityBridge]: config.get('dfinity_bridge'),
  [ContractKey.DfinityToken]: config.get('dfinity_token'),
};
