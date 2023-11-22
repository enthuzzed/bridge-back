import type { Principal } from '@dfinity/principal';
export type TxReceipt = { 'Ok' : bigint } |
  {
    'Err' : { 'InsufficientAllowance' : null } |
      { 'InsufficientBalance' : null } |
      { 'ErrorOperationStyle' : null } |
      { 'Unauthorized' : null } |
      { 'LedgerTrap' : null } |
      { 'ErrorTo' : null } |
      { 'Other' : string } |
      { 'BlockUsed' : null } |
      { 'AmountTooSmall' : null }
  };
export default interface bridgeDid {
  'canisterTokenBalance' : () => Promise<bigint>,
  'evacuateTokens' : (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>,
  'getBotMassenger' : () => Promise<Principal>,
  'getFee' : () => Promise<bigint>,
  'getOwner' : () => Promise<Principal>,
  'init' : (arg_0: Principal, arg_1: bigint, arg_2: Principal) => Promise<
    undefined
    >,
  'performBridgingToStart' : (arg_0: bigint, arg_1: Principal) => Promise<
    TxReceipt
    >,
  'requestBridgingToEnd' : (arg_0: bigint, arg_1: Principal) => Promise<
    TxReceipt
    >,
  'setBotMassenger' : (arg_0: Principal) => Promise<boolean>,
  'setFee' : (arg_0: bigint) => Promise<boolean>,
  'setOwner' : (arg_0: Principal) => Promise<boolean>,
};