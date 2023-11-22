import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BasicEntity } from '.';
import {
  TableNameEnum,
  BlockchainTypeEnum,
  TransactionStateEnum,
} from './enums';

@Entity({ name: TableNameEnum.TRANSACTION })
export class TransactionEntity extends BasicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'sender',
    type: 'varchar',
    nullable: false,
  })
  sender: string;

  @Column({
    name: 'sender_type',
    type: 'varchar',
    nullable: false,
  })
  senderType: BlockchainTypeEnum;

  @Column({
    name: 'recipient_token',
    type: 'varchar',
    nullable: false,
  })
  recipient: string;

  @Column({
    name: 'recipient_type',
    type: 'varchar',
    nullable: false,
  })
  recipientType: BlockchainTypeEnum;

  @Column({
    name: 'state',
    type: 'varchar',
    nullable: false,
  })
  state: TransactionStateEnum;

  @Column({
    name: 'dfinity_id',
    type: 'integer',
    nullable: true,
  })
  dfinityId: number;

  @Column({
    name: 'polygon_transaction_id',
    type: 'varchar',
    nullable: true,
  })
  polygonTransactionId: string;

  @Column({
    name: 'amount',
    type: 'varchar',
    nullable: false,
  })
  amount: string;
}
