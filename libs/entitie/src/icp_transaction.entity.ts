import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BasicEntity } from '.';
import {
  TableNameEnum,
} from './enums';

@Entity({ name: TableNameEnum.ICP_TRANSACTION })
export class ICPTransactionEntity extends BasicEntity {
  @PrimaryColumn()
  hash: string;
}
