import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '@app/entitie';
import { TransactionDaoService } from '@app/dao/transaction-dao/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [TransactionDaoService],
  exports: [TransactionDaoService],
})
export class TransactionDaoModule {}
