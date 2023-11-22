import { Principal } from '@dfinity/principal';

export interface IDfinityRequestBridgingToEnd {
  id: number,
  address: string,
  caller: Principal,
  amount: BigInteger
}
