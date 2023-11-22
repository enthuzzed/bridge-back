import { Injectable, Logger } from '@nestjs/common';
import { ContractKey } from '@app/constants';
import { BaseContract } from './base.contract';
import {
  PolygonBridgeContractMethods,
  PolygonBridgeContractEvents,
} from './interfaces';

@Injectable()
export class PolygonBridgeContract extends BaseContract<
  PolygonBridgeContractMethods,
  PolygonBridgeContractEvents
> {
  private readonly logger = new Logger(PolygonBridgeContract.name, {
    timestamp: true,
  });

  protected readonly contractKey: ContractKey = ContractKey.PolygonBridge;

  async requestBridgingToStart(ammount: number, receiver: string) {
    return this.contract.methods
      .requestBridgingToStart(ammount, receiver)
      .call();
  }

  async performBridgingToEnd(
    _to: string,
    _amount: string,
    _name: string,
    _symbol: string,
    _decimals: number,
  ) {
    const transaction = this.contract.methods.performBridgingToEnd(
      _to,
      BigInt(_amount),
      _name,
      _symbol,
      _decimals,
    );
    const result = await this.sendSignedTransaction(transaction);
    this.logger.log(result);
    return result;
  }

  listenRequestBridgingToStart() {
    return this.contract.events.RequestBridgingToStart();
  }

  listenBridgingToEndPerformed() {
    return this.contract.events.BridgingToEndPerformed();
  }
}
