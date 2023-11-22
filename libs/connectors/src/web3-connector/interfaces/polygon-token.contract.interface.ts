import { EventData } from 'web3-eth-contract';
import { Web3ContractSendMethodInterface, Web3ContractEventInterface } from '.';

export interface PolygonTokenContractMethods {
  approve: (
    account: string,
    amount: number,
  ) => Web3ContractSendMethodInterface<boolean>;
  balanceOf: (account: string) => Web3ContractSendMethodInterface<number>;
}

export interface PolygonTokenContractEvents {}
