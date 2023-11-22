import { Injectable } from '@nestjs/common';
import { RossetaApiService } from '@app/rosseta-api';
import { IcpTransactionDAOService } from '@app/dao';
import { contractsConfig } from '@app/configuration';
import { ContractKey } from '@app/constants';
import { IOperation } from '@app/rosseta-api/interfaces/rosseta.interface';
import * as moment from 'moment';

@Injectable()
export class IcpTransactionService {
  constructor(private readonly rossetaApiService: RossetaApiService) {}

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async checkICPTransaction(
    userAddress: string,
    amount: number,
    blockId: number,
    count: number,
  ): Promise<{ result: boolean; hash: string }> {
    const tokenConfig = contractsConfig[ContractKey.DfinityToken];
    const ICPTransaction = await this.rossetaApiService.getUserTransaction(
      userAddress,
    );

    const blockTransaction = ICPTransaction.transactions.filter(
      (transaction) => {
        const date = moment.utc().subtract(1, 'day');

        const transactionUtc =
          transaction.transaction.metadata.timestamp / 1000000;

        const transactionDate = moment.utc(transactionUtc);

        const operations = transaction.transaction.operations.filter((op) => {
          return (
            op.account.address === tokenConfig.address &&
            op.amount.value === String(amount)
          );
        });
        return (
          operations.length > 0 &&
          date.isBefore(transactionDate) &&
          transaction.block_identifier.index === blockId
        );
      },
    );

    if (blockTransaction.length > 0) {
      return {
        result: true,
        hash: blockTransaction[0].block_identifier.hash,
      };
    }
    const bridgeTransactions = ICPTransaction.transactions.filter(
      (transaction) => {
        const date = moment.utc().subtract(1, 'day');

        const transactionUtc =
          transaction.transaction.metadata.timestamp / 1000000;

        const transactionDate = moment.utc(transactionUtc);

        const operations = transaction.transaction.operations.filter((op) => {
          return (
            op.account.address === tokenConfig.address &&
            op.amount.value === String(amount)
          );
        });
        return operations.length > 0 && date.isBefore(transactionDate);
      },
    );

    if (bridgeTransactions.length > 0) {
      return {
        result: true,
        hash: bridgeTransactions[0].block_identifier.hash,
      };
    } else {
      if (count >= 2) {
        return { result: false, hash: '' };
      }
      await this.delay(10000);
      return this.checkICPTransaction(userAddress, amount, blockId, count + 1);
    }
  }
}
