
import { ContractKey } from '@app/constants';

export interface BlockchainConfigInterface {
  readonly polygonUrl: string;
  readonly dfinityUrl: string;
  readonly abiFilesDir: string;
  readonly didFilesDir: string;
}

export interface ContractInterface {
  readonly owner: string;
  readonly contractAddress: string;
  readonly privateKey: string;
  readonly address: string;
}

export type ContractsConfigInterface = {
  readonly [contractKey in ContractKey]: ContractInterface;
};
