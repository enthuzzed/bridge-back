import { Injectable } from '@nestjs/common';
import {Cron, CronExpression, SchedulerRegistry} from '@nestjs/schedule';
import { TransactionDaoService } from '@app/dao/transaction-dao/transaction.service';
import {
  BlockchainTypeEnum,
  TransactionEntity,
  TransactionStateEnum,
} from '@app/entitie';
import { DfinityBridgeContract, PolygonBridgeContract } from '@app/connectors';
import BigNumber from 'bignumber.js';
import { DfinityTokenContract } from '@app/connectors/dfinity-connector/dfinity-token.contract';
import { IDfinityRequestBridgingToEnd } from '@app/connectors/dfinity-connector/interfaces';
import { IsNull, Not } from 'typeorm';

@Injectable()
export class CheckTransactionService {
  constructor(
    private readonly transactionDaoService: TransactionDaoService,
    private readonly polygonBridgeContract: PolygonBridgeContract,
    private readonly dfinityBridgeContract: DfinityBridgeContract,
    private readonly dfinityTokenContract: DfinityTokenContract,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron('*/2 * * * *', { name: 'CheckTransactionService' })
  async checkTransactionCron() {
    const job = this.schedulerRegistry.getCronJob('CheckTransactionService');

    job.stop();
    try {
      const transactions =
        await this.transactionDaoService.findInProgressTransaction();

      const proms = transactions.map((transaction) => {
        return this.checkTransaction(transaction);
      });
      await Promise.all(proms);
    } catch (e) {
    } finally {
      job.start();
    }
  }

  @Cron('*/20 * * * *', { name: 'CheckCompletedTransactionService' })
  async checkTransactionCompletedCron() {
    const job = this.schedulerRegistry.getCronJob(
      'CheckCompletedTransactionService',
    );

    job.stop();

    try {
      const [transactions] = await this.transactionDaoService.find({
        where: {
          state: TransactionStateEnum.COMPLETED,
          dfinityId: Not(IsNull()),
        },
      });

      const dfinityIds = transactions.map(
        (transaction) => transaction.dfinityId,
      );

      const res =
        await this.dfinityBridgeContract.deleteRequestBridgingToEndInfosFromList(
          dfinityIds,
        );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        const proms = transactions.map((transaction) => {
          transaction.dfinityId = null;
          return this.transactionDaoService.update(transaction);
        });
        await Promise.all(proms);
      }
    } catch (e) {
    } finally {
      job.start();
    }
  }

  async checkTransaction(transaction: TransactionEntity) {
    const tr2 = await this.polygonBridgeContract.getTransactionReceipt(
      transaction.polygonTransactionId,
    );

    if (!tr2) {
      return;
    }
    if (tr2.status) {
      if (transaction.senderType === BlockchainTypeEnum.DFINITY) {
        transaction.state = TransactionStateEnum.COMPLETED;
        await this.transactionDaoService.update(transaction);
        return;
      }

      const fee = await this.dfinityTokenContract.getFee();

      const amount = new BigNumber(transaction.amount).multipliedBy(
        100 - 0.1 * Number(fee),
      );

      const dfinityRes =
        await this.dfinityBridgeContract.performBridgingToStart(
          amount.toString(),
          transaction.recipient,
        );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (dfinityRes.Ok) {
        transaction.state = TransactionStateEnum.COMPLETED;
        await this.transactionDaoService.update(transaction);
      }
    } else {
      transaction.state = TransactionStateEnum.CANCELED;
      await this.transactionDaoService.update(transaction);
    }
  }

  @Cron('*/3 * * * *', { name: 'checkDfinityPerformStart' })
  async checkDfinityRequestBridgingToEnd() {
    const job = this.schedulerRegistry.getCronJob('checkDfinityPerformStart');

    job.stop();
    try {
      const transactions = <IDfinityRequestBridgingToEnd[]>(
        await this.dfinityBridgeContract.getRequestBridgingToEndList()
      );

      for (const transaction of transactions)
        await this.checkRequestBridgingToEnd(transaction);

    } catch (e) {
    } finally {
      job.start();
    }
  }

  async checkRequestBridgingToEnd(
    requestBridgingToEnd: IDfinityRequestBridgingToEnd,
  ) {
    try {
      const [transaction] = await this.transactionDaoService.find({
        where: {
          sender: requestBridgingToEnd.caller.toString(),
          recipient: requestBridgingToEnd.address,
          amount: String(Number(requestBridgingToEnd.amount)),
          dfinityId: Number(requestBridgingToEnd.id),
        },
      });

      if (transaction.length > 0) {
        return;
      }

      const dto = {
        sender: requestBridgingToEnd.caller.toString(),
        senderType: BlockchainTypeEnum.DFINITY,
        amount: String(Number(requestBridgingToEnd.amount)),
        recipient: requestBridgingToEnd.address,
        recipientType: BlockchainTypeEnum.DFINITY,
        state: TransactionStateEnum.IN_PROGRESS,
        dfinityId: Number(requestBridgingToEnd.id),
      };

      //const tr = await this.transactionDaoService.create(dto);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      //dto.id = tr.identifiers[0].id;

      const polygonTransaction =
        await this.polygonBridgeContract.performBridgingToEnd(
          dto.recipient,
          dto.amount,
          'WrappedICP',
          'WICP',
          8,
        );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dto.polygonTransactionId = polygonTransaction.transactionHash;
      await this.transactionDaoService.create(dto);
    } catch (e) {
      console.error(e);
    }
  }
}
