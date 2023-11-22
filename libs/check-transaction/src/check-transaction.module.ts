import { Module } from '@nestjs/common';
import { CheckTransactionService } from './check-transaction.service';
import { TransactionDaoModule } from '@app/dao';
import { DfinityConnectorModule, Web3ConnectorModule } from '@app/connectors';
import { blockchainConfig } from '@app/configuration';
import { Web3ConnectionTypeEnum } from '@app/connectors/web3-connector/enums';

@Module({
  imports: [
    Web3ConnectorModule.forRoot({
      url: blockchainConfig.polygonUrl,
      connectionType: Web3ConnectionTypeEnum.WSS,
    }),
    DfinityConnectorModule.forRoot({
      url: blockchainConfig.dfinityUrl,
    }),
    TransactionDaoModule,
  ],
  providers: [CheckTransactionService],
  exports: [CheckTransactionService],
})
export class CheckTransactionModule {}
