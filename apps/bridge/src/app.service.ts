import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DfinityBridgeContract, PolygonBridgeContract } from '@app/connectors';
import { PolygonTokenContract } from '@app/connectors/web3-connector/polygon-token.contract';
import { DfinityTokenContract } from '@app/connectors/dfinity-connector/dfinity-token.contract';
import { TransactionInterface } from '@app/dao/transaction-dao/transaction.interface';
import { TransactionDaoService } from '@app/dao/transaction-dao/transaction.service';
import { BlockchainTypeEnum, TransactionStateEnum } from '@app/entitie';
import { GetWrapperTokenDto } from './dto/get-wrapper-token.dto';
import { UnwrappedWICPDto } from './dto/unwrapped-WICP.dto';
import { CheckTransactionService } from '@app/check-transaction';
import { contractsConfig } from '@app/configuration';
import { getAccountId } from '@app/utils';
import { Principal } from '@dfinity/principal';
import { IcpTransactionService } from '@app/icp-transaction';
import { IcpTransactionDAOService } from '@app/dao';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name, {
    timestamp: true,
  });

  constructor(
    private readonly polygonBridgeContract: PolygonBridgeContract,
    private readonly dfinityBridgeContract: DfinityBridgeContract,
    private readonly polygonTokenContract: PolygonTokenContract,
    private readonly dfinityTokenContract: DfinityTokenContract,
    private readonly transactionDaoService: TransactionDaoService,
    private checkTransactionService: CheckTransactionService,
    private readonly icpTransactionService: IcpTransactionService,
    private readonly icpTransactionDAOService: IcpTransactionDAOService,
  ) {}

  async getWrapperToken(dto: GetWrapperTokenDto) {
    const address = getAccountId(Principal.fromText(dto.uAddress));

    /*  

   */
    const chekResult = await this.icpTransactionService.checkICPTransaction(
      address,
      dto.amount,
      dto.blockId,
      0
    );

    if (!chekResult.result) {
      throw new BadRequestException({ message: 'ICP transaction not found' });
    }

    const checkDBTransaction = await this.icpTransactionDAOService.findOne({
      where: { hash: chekResult.hash },
    });

    if (checkDBTransaction) {
      throw new BadRequestException({ message: 'ICP transaction already processed' });
    }

    const res = await this.dfinityTokenContract.getWrapperToken(
      dto.uAddress,
      dto.amount,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (res.Err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.logger.error(res.Err);
      throw new BadRequestException(res.Err);
    }
    await this.icpTransactionDAOService.insert({ hash: chekResult.hash });
    return { message: 'Ok' };
  }

  async unwrappedWICP(dto: UnwrappedWICPDto) {
    const res = await this.dfinityTokenContract.unwrappedWICP(
      dto.uAddress,
      dto.amount,
    );

    if (res.Err) {
      this.logger.error(res.Err);
      throw new BadRequestException(res.Err);
    }

    return { message: 'Ok' };
  }

  async getWalletTransactions(wallet: string) {
    return this.transactionDaoService.findByWallet(wallet);
  }

  async saveTransaction(dto: TransactionInterface) {
    //const polygonTransaction = await this.polygonBridgeContract.performBridgingToEnd(dto.recipient, dto.amount, 'WrappedICP', 'WICP', 8)

    if (dto.senderType === BlockchainTypeEnum.POLYGON) {
      if (!dto.polygonTransactionId) {
        throw new BadRequestException({
          message: 'polygonTransactionId required',
        });
      }
      const transaction = await this.polygonBridgeContract.getTransaction(
        dto.polygonTransactionId,
      );

      if (!transaction) {
        throw new BadRequestException({
          message: 'wrong polygonTransactionId ',
        });
      }

      if (
        transaction.to.toLowerCase() !==
        contractsConfig.polygonBridgeContract.contractAddress.toLowerCase()
      ) {
        throw new BadRequestException({
          message: 'wrong polygonTransactionId ',
        });
      }

      if (transaction.from.toLowerCase() !== dto.sender.toLowerCase()) {
        throw new BadRequestException({
          message: 'wrong polygonTransaction',
        });
      }

      const transactions =
        await this.transactionDaoService.findTransactionByHash(
          dto.polygonTransactionId,
        );

      if (transactions.length > 0) {
        throw new BadRequestException({
          message:
            'the transaction has already been processed or is being processed ',
        });
      }
    }
    try {
      dto.state = TransactionStateEnum.IN_PROGRESS;
      const tr = await this.transactionDaoService.create(dto);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dto.id = tr.identifiers[0].id;

      if (dto.senderType === BlockchainTypeEnum.DFINITY) {
        const res = await this.dfinityBridgeContract.requestBridgingToEnd(
          dto.amount,
          dto.sender,
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res.Err) {
          dto.state = TransactionStateEnum.CANCELED;
          await this.transactionDaoService.update(dto);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res.Ok) {
          const polygonTransaction =
            await this.polygonBridgeContract.performBridgingToEnd(
              dto.recipient,
              dto.amount,
              'WrappedICP',
              'WICP',
              8,
            );
          dto.polygonTransactionId = polygonTransaction.transactionHash;
          await this.transactionDaoService.update(dto);
        } else {
          dto.state = TransactionStateEnum.CANCELED;
          await this.transactionDaoService.update(dto);
        }
      } else {
      }
      return dto;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }
}
