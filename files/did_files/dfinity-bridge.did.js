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
  const RequestBridgingToEndInfo = IDL.Record({
    'id' : IDL.Nat,
    'address' : IDL.Text,
    'caller' : IDL.Principal,
    'amount' : IDL.Nat,
  });
  return IDL.Service({
    'canisterTokenBalance' : IDL.Func([], [IDL.Nat], []),
    'deleteRequestBridgingToEndInfosFromList' : IDL.Func(
      [IDL.Vec(IDL.Nat)],
      [IDL.Bool],
      [],
    ),
    'evacuateTokens' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    'getBotMassenger' : IDL.Func([], [IDL.Principal], ['query']),
    'getOwner' : IDL.Func([], [IDL.Principal], ['query']),
    'getRequestBridgingToEndList' : IDL.Func(
      [],
      [IDL.Vec(RequestBridgingToEndInfo)],
      ['query'],
    ),
    'init' : IDL.Func([IDL.Principal, IDL.Principal], [], ['oneway']),
    'performBridgingToStart' : IDL.Func(
      [IDL.Nat, IDL.Principal],
      [TxReceipt],
      [],
    ),
    'requestBridgingToEnd' : IDL.Func([IDL.Nat, IDL.Text], [TxReceipt], []),
    'setBotMassenger' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
