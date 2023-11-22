import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICPTransactionEntity } from '@app/entitie';
import { IcpTransactionDAOService } from '@app/dao/icp-transaction-dao/icp-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([ICPTransactionEntity])],
  providers: [IcpTransactionDAOService],
  exports: [IcpTransactionDAOService],
})
export class IcpTransactionDAOModule {}
