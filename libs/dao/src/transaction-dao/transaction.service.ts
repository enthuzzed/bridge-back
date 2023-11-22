import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  In,
  InsertResult,
  IsNull,
  Not,
  Repository,
  UpdateResult,
} from 'typeorm';
import { TransactionEntity, TransactionStateEnum } from '@app/entitie';
import { TransactionInterface } from './transaction.interface';

@Injectable()
export class TransactionDaoService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(transactionDao: TransactionInterface): Promise<InsertResult> {
    return this.transactionRepository.insert(transactionDao);
  }

  async find(options) {
    return this.transactionRepository.findAndCount(options);
  }

  async findAll(): Promise<TransactionEntity[]> {
    return this.transactionRepository.find();
  }

  async findInProgressTransaction(): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: {
        state: TransactionStateEnum.IN_PROGRESS,
        polygonTransactionId: Not(IsNull()),
      },
    });
  }

  async findTransactionByHash(hash: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: {
        state: In([
          TransactionStateEnum.IN_PROGRESS,
          TransactionStateEnum.COMPLETED,
        ]),
        polygonTransactionId: hash,
      },
    });
  }

  async findByWallet(wallet: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: [
        {
          recipient: wallet,
        },
        {
          sender: wallet,
        },
      ],
    });
  }

  async findOne(sender: string): Promise<TransactionEntity> {
    return this.transactionRepository.findOne({ sender });
  }

  async findOneByPolygonTransaction(
    transactionHash: string,
  ): Promise<TransactionEntity> {
    return this.transactionRepository.findOne({
      polygonTransactionId: transactionHash,
    });
  }

  async update(transactionDao: TransactionInterface): Promise<UpdateResult> {
    return this.transactionRepository.update(
      { id: transactionDao.id },
      transactionDao,
    );
  }

  async delete(sender: string): Promise<DeleteResult> {
    return this.transactionRepository.delete({ sender });
  }
}
