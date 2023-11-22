import { ApiProperty } from '@nestjs/swagger';
import { BlockchainTypeEnum, TransactionStateEnum } from '@app/entitie';
import { TransactionInterface } from '@app/dao/transaction-dao/transaction.interface';

export class TransactionDto implements TransactionInterface {
  @ApiProperty({ description: 'Trait name' })
  readonly id: number;

  @ApiProperty({ description: 'sender' })
  readonly sender: string;

  @ApiProperty({ description: 'sender type' })
  readonly senderType: BlockchainTypeEnum;

  @ApiProperty({ description: 'amount' })
  amount: string;

  @ApiProperty({ description: 'recipient' })
  recipient: string;

  @ApiProperty({ description: 'recipient type' })
  recipientType: BlockchainTypeEnum;

  @ApiProperty({ description: 'state' })
  state: TransactionStateEnum;

  @ApiProperty({ description: 'polygon transaction Id' })
  polygonTransactionId: string;
}
