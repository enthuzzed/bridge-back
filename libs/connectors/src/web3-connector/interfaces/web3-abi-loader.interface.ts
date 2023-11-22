import { AbiItem } from 'web3-utils';

export interface Web3AbiLoaderInterface {
  getAbi(contractAddress: string): Promise<AbiItem | AbiItem[]>;
}
