import { Injectable, Logger } from '@nestjs/common';
import { ContractKey } from '@app/constants';

import { DfinityBaseContract } from '@app/connectors/dfinity-connector/dfinity-base.contract';
import { Principal } from '@dfinity/principal';

import { blockchainConfig, contractsConfig } from '@app/configuration';
import { TextDecoder } from 'util';
import { IDfinityRequestBridgingToEnd } from "@app/connectors/dfinity-connector/interfaces/dfinity.interface";

@Injectable()
export class DfinityBridgeContract extends DfinityBaseContract {
  private readonly logger = new Logger(DfinityBridgeContract.name, {
    timestamp: true,
  });

  protected readonly contractKey: ContractKey = ContractKey.DfinityBridge;

  async deleteRequestBridgingToEndInfosFromList(ids: number[]) {
    return this.contract.deleteRequestBridgingToEndInfosFromList(
      ids
    );
  }

  async performBridgingToStart(amount, principal) {
    return this.contract.performBridgingToStart(
      BigInt(amount),
      Principal.fromText(principal),
    );
  }

  async requestBridgingToEnd(amount, principal) {
    return this.contract.requestBridgingToEnd(
      BigInt(amount),
      Principal.fromText(principal),
    );
  }

  async getRequestBridgingToEndList() {
    return await this.contract.getRequestBridgingToEndList();
  }
}
