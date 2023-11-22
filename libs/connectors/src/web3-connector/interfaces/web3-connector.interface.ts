import { EventEmitter } from 'events';
import { PromiEvent } from 'web3-core';
import {
  CallOptions,
  Contract,
  ContractSendMethod,
  SendOptions,
  EventData,
} from 'web3-eth-contract';

export interface BaseContractInterface<M, E> extends Contract {
  methods: M;
  events: E;
}

export interface Web3ContractSendMethodInterface<T> extends ContractSendMethod {
  call(
    options?: CallOptions,
    callback?: (err: Error, result: T) => void,
  ): Promise<T>;
  send(
    options: SendOptions,
    callback?: (err: Error, transactionHash: string) => void,
  ): PromiEvent<Contract>;
}

export interface Web3ContractEventInterface<T extends EventData>
  extends EventEmitter {
  on(eventName: 'connected', listener: (subscriptionId: string) => void): this;
  on(eventName: 'data', listener: (event: T) => void): this;
  on(eventName: 'error', listener: (error: {}, receipt: {}) => void): this;
  on(eventName: 'changed', listener: (event: T) => void): this;
}
