import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import {
  Actor,
  ActorSubclass,
  HttpAgent,
  RequestStatusResponseStatus,
} from '@dfinity/agent';
import fetch from 'node-fetch';
import { ContractKey, DFINITY_PROVIDER } from '@app/constants';
import { blockchainConfig, contractsConfig } from '@app/configuration';
import { DfinityDidLoader } from '@app/connectors/dfinity-connector/core/dfinity-did-loader';
import bridge from '../../../../files/did_files/dfinity-bridge.did';
import token from '../../../../files/did_files/dfinity-token.did';

global.fetch = fetch;

export class DfinityBaseContract implements OnApplicationBootstrap {
  protected contract: ActorSubclass;
  protected readonly contractKey: ContractKey;

  constructor(
    @Inject(DFINITY_PROVIDER) protected readonly httpAgent: HttpAgent,
  ) {}

  async onApplicationBootstrap() {
    await this.initializeContract();
  }

  async initializeContract(): Promise<void> {
    const { contractAddress } = contractsConfig[this.contractKey];


    let idlFactory = bridge;

    switch (this.contractKey) {
      case ContractKey.DfinityBridge:
        idlFactory = bridge;
        break;
      case ContractKey.DfinityToken:
        idlFactory = token;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.contract = Actor.createActor(idlFactory, {
      agent: this.httpAgent,
      canisterId: contractAddress,
    });
  }
}
