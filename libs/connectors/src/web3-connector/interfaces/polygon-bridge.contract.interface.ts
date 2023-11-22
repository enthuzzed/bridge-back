import { EventData } from 'web3-eth-contract';
import { Web3ContractSendMethodInterface, Web3ContractEventInterface } from '.';

export interface PolygonBridgeContractMethods {
  performBridgingToEnd: (
    _to: string,
    _amount: BigInt,
    _name: string,
    _symbol: string,
    _decimals: number,
  ) => Web3ContractSendMethodInterface<void>;
  requestBridgingToStart: (
    _ammount: number,
    receive: string,
  ) => Web3ContractSendMethodInterface<void>;
}

export type PolygonReturnValues = EventData;

export interface PolygonBridgeContractEvents {
  RequestBridgingToStart: () => Web3ContractEventInterface<EventData>;
  BridgingToEndPerformed: () => Web3ContractEventInterface<EventData>;
}
