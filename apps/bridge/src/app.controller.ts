import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionInterface } from '@app/dao/transaction-dao/transaction.interface';
import {
  ApiBody, ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { TransactionEntity } from '@app/entitie';
import { TransactionDto } from './dto/transaction.dto';
import {GetWrapperTokenDto} from "./dto/get-wrapper-token.dto";
import {UnwrappedWICPDto} from "./dto/unwrapped-WICP.dto";

@Controller()
@ApiInternalServerErrorResponse()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ description: 'Get a wallet transfer transactions' })
  @ApiOkResponse({
    type: TransactionEntity,
    description: 'Wallet transfer transactions',
  })
  @Get('/:wallet/transactions')
  getTransaction(@Param('wallet') wallet: string) {
    return this.appService.getWalletTransactions(wallet);
  }

  @ApiOperation({
    summary: 'Get wrapper token',
  })
  @Post('wrapper-token')
  getWrapperToken(@Body() dto: GetWrapperTokenDto) {
    return this.appService.getWrapperToken(dto)
  }


}
