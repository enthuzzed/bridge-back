import { Module } from '@nestjs/common';
import { PolygonListenerController } from './polygon-listener.controller';
import { PolygonListenerService } from './polygon-listener.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { blockchainConfig, dbConfiguration } from '@app/configuration';
import { TransactionDaoModule } from '@app/dao';
import { DfinityConnectorModule, Web3ConnectorModule } from '@app/connectors';
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
    TypeOrmModule.forRoot(dbConfiguration),
    TransactionDaoModule,
  ],
  providers: [PolygonListenerService],
  controllers: [PolygonListenerController],
})
export class PolygonListenerModule {}
