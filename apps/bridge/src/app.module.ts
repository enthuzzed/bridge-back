import { Injectable, Module } from '@nestjs/common';
import { Web3ConnectorModule, DfinityConnectorModule } from '@app/connectors';
import { blockchainConfig, dbConfiguration } from '@app/configuration';
import { Web3ConnectionTypeEnum } from '@app/connectors/web3-connector/enums';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDaoService } from '@app/dao/transaction-dao/transaction.service';
import { TransactionEntity } from '@app/entitie';
import { IcpTransactionDAOModule, TransactionDaoModule } from "@app/dao";
import { ScheduleModule } from '@nestjs/schedule';
import { CheckTransactionModule } from '@app/check-transaction';
import { IcpTransactionModule } from "@app/icp-transaction";

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfiguration),
    Web3ConnectorModule.forRoot({
      url: blockchainConfig.polygonUrl,
      connectionType: Web3ConnectionTypeEnum.WSS,
    }),
    DfinityConnectorModule.forRoot({
      url: blockchainConfig.dfinityUrl,
    }),
    ScheduleModule.forRoot(),
    TransactionDaoModule,
    CheckTransactionModule,
    IcpTransactionModule,
    IcpTransactionDAOModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
