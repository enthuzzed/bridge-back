import { Injectable, Logger } from '@nestjs/common';
import { ContractKey } from '@app/constants';
import { BaseContract } from './base.contract';
import {
  PolygonTokenContractEvents,
  PolygonTokenContractMethods,
} from './interfaces';
import BigNumber from 'bignumber.js';
import { contractsConfig } from '@app/configuration';

@Injectable()
export class PolygonTokenContract extends BaseContract<
  PolygonTokenContractMethods,
  PolygonTokenContractEvents
> {
  private readonly logger = new Logger(PolygonTokenContract.name, {
    timestamp: true,
  });

  protected readonly contractKey: ContractKey = ContractKey.PolygonToken;

  async approve(token: string, ammount: number) {
    //return this.contract.methods.approve(token, ammount).send({from: token, gas:3000000});
    const transaction = this.contract.methods.approve(token, ammount);

    const {
      [this.contractKey]: { owner: from, contractAddress: to, privateKey },
    } = contractsConfig;
    const estimatedGas = await transaction.estimateGas({ from: token });
    const gasPrice = await this.web3.eth.getGasPrice();
    const fullGasPrice = new BigNumber(gasPrice).multipliedBy(5).toFixed(0);
    const data = transaction.encodeABI();
    const chainId = await this.web3.eth.net.getId();

    const singedTx = await this.web3.eth.accounts.signTransaction(
      {
        to,
        gas: estimatedGas,
        data,
        gasPrice: fullGasPrice,
        chainId,
      },
      privateKey,
    );

    return this.web3.eth.sendSignedTransaction(singedTx.rawTransaction);
    const result = await this.sendSignedTransaction(transaction);
    this.logger.log(result);
    return result;
  }

  async balanceOf(token: string) {
    return await this.contract.methods.balanceOf(token).call();
  }
}
