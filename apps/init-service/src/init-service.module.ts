import { initialDbConfiguration } from '@app/configuration';
import { TransactionEntity } from '@app/entitie';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitServiceService } from './init-service.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(initialDbConfiguration),
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  providers: [InitServiceService],
})
export class InitServiceModule {}
