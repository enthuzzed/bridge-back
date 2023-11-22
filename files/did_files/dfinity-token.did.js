export default ({ IDL }) => {
  const TxReceipt = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : IDL.Variant({
      'InsufficientAllowance' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'ErrorOperationStyle' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'LedgerTrap' : IDL.Null,
      'ErrorTo' : IDL.Null,
      'Other' : IDL.Text,
      'BlockUsed' : IDL.Null,
      'AmountTooSmall' : IDL.Null,
    }),
  });
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const Metadata = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat8,
    'owner' : IDL.Principal,
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'totalSupply' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const Time = IDL.Int;
  const TokenInfo = IDL.Record({
    'holderNumber' : IDL.Nat,
    'deployTime' : Time,
    'metadata' : Metadata,
    'historySize' : IDL.Nat,
    'cycles' : IDL.Nat,
    'feeTo' : IDL.Principal,
  });
  return IDL.Service({
    'allowance' : IDL.Func(
      [IDL.Principal, IDL.Principal],
      [IDL.Nat],
      ['query'],
    ),
    'approve' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'burn' : IDL.Func([IDL.Nat], [TxReceipt], []),
    'canisterBalanceICP' : IDL.Func([], [Tokens], []),
    'getAllowanceSize' : IDL.Func([], [IDL.Nat], ['query']),
    'getBotMassenger' : IDL.Func([], [IDL.Principal], ['query']),
    'getDecimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'getFeeRate' : IDL.Func([], [IDL.Nat], []),
    'getHolders' : IDL.Func(
      [IDL.Nat, IDL.Nat],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
      ['query'],
    ),
    'getLogo' : IDL.Func([], [IDL.Text], ['query']),
    'getMetadata' : IDL.Func([], [Metadata], ['query']),
    'getName' : IDL.Func([], [IDL.Text], ['query']),
    'getOwner' : IDL.Func([], [IDL.Principal], ['query']),
    'getPrincipal' : IDL.Func([], [IDL.Principal], []),
    'getPrincipalCanister' : IDL.Func([], [IDL.Principal], []),
    'getSymbol' : IDL.Func([], [IDL.Text], ['query']),
    'getTokenFee' : IDL.Func([], [IDL.Nat], ['query']),
    'getTokenInfo' : IDL.Func([], [TokenInfo], ['query']),
    'getTotalSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'getUserApprovals' : IDL.Func(
      [IDL.Principal],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
      ['query'],
    ),
    'getWrapperToken' : IDL.Func([IDL.Nat, IDL.Principal], [TxReceipt], []),
    'historySize' : IDL.Func([], [IDL.Nat], ['query']),
    'init' : IDL.Func(
      [
        IDL.Text,
        IDL.Text,
        IDL.Text,
        IDL.Nat8,
        IDL.Principal,
        IDL.Principal,
        IDL.Principal,
        IDL.Nat,
        IDL.Nat,
      ],
      [],
      ['oneway'],
    ),
    'mint' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    'setBotMassenger' : IDL.Func([IDL.Principal], [], ['oneway']),
    'setFee' : IDL.Func([IDL.Nat], [], ['oneway']),
    'setFeeRate' : IDL.Func([IDL.Nat], [], ['oneway']),
    'setFeeTo' : IDL.Func([IDL.Principal], [], ['oneway']),
    'setFeeWallet' : IDL.Func([IDL.Principal], [], ['oneway']),
    'setLogo' : IDL.Func([IDL.Text], [], ['oneway']),
    'setName' : IDL.Func([IDL.Text], [], ['oneway']),
    'setOwner' : IDL.Func([IDL.Principal], [], ['oneway']),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    'transferFrom' : IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Nat],
      [TxReceipt],
      [],
    ),
    'unwrappedWICP' : IDL.Func([IDL.Nat, IDL.Principal], [TxReceipt], []),
  });
};
export const init = ({ IDL }) => { return []; };
