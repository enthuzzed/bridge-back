import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { ContractKey } from '@app/constants';
import { Principal } from '@dfinity/principal';

import { DfinityBaseContract } from '@app/connectors/dfinity-connector/dfinity-base.contract';

@Injectable()
export class DfinityTokenContract extends DfinityBaseContract {
  private readonly logger = new Logger(DfinityTokenContract.name, {
    timestamp: true,
  });

  protected readonly contractKey: ContractKey = ContractKey.DfinityToken;

  async getFee() {
    return this.contract.getFeeRate();
  }

  async approve(token: string, amount: number) {
    const res = await this.contract.approve(
      Principal.fromText(token),
      BigInt(amount),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return !!res.Ok;
  }

  async getWrapperToken(
    uAddress: string,
    amount: number,
  ): Promise<{ Err?: any; Ok?: any }> {
    return this.contract.getWrapperToken(
      BigInt(amount),
      Principal.fromText(uAddress),
    );
  }

  async unwrappedWICP(
    uAddress: string,
    amount: number,
  ): Promise<{ Err?: any; Ok?: any }> {
    return this.contract.unwrappedWICP(
      BigInt(amount),
      Principal.fromText(uAddress),
    );
  }
}
