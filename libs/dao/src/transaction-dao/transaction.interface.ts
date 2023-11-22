import { BlockchainTypeEnum, TransactionStateEnum } from '@app/entitie';

export interface TransactionInterface {
  id?: number;
  sender: string;
  senderType: BlockchainTypeEnum;
  amount: string;
  recipient: string;
  recipientType: BlockchainTypeEnum;
  state: TransactionStateEnum;
  dfinityId?: number | null;
  polygonTransactionId?: string;
}
