import { Module } from '@nestjs/common';
import { IcpTransactionService } from './icp-transaction.service';
import { RossetaApiModule } from '@app/rosseta-api';
import { IcpTransactionDAOModule } from '@app/dao';

@Module({
  imports: [RossetaApiModule, IcpTransactionDAOModule],
  providers: [IcpTransactionService],
  exports: [IcpTransactionService],
})
export class IcpTransactionModule {}
