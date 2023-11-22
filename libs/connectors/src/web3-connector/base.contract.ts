import { OnApplicationBootstrap, Inject } from '@nestjs/common';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { WEB3_PROVIDER, ContractKey } from '@app/constants';
import { blockchainConfig, contractsConfig } from '@app/configuration';
import { BaseContractInterface, ContractEvents } from './interfaces';
import { Web3AbiLoader } from './core/web3-abi-loader';

export class BaseContract<M, E extends ContractEvents>
  implements OnApplicationBootstrap
{
  protected contract: BaseContractInterface<M, E>;
  protected readonly contractKey: ContractKey;

  constructor(@Inject(WEB3_PROVIDER) protected readonly web3: Web3) {}

  async onApplicationBootstrap() {
    await this.initializeContract();
  }

  async initializeContract(): Promise<void> {
    const { contractAddress } = contractsConfig[this.contractKey];
    const loader = new Web3AbiLoader(blockchainConfig.abiFilesDir);
    const contractAbi = await loader.getAbi(contractAddress);
    this.contract = new this.web3.eth.Contract(contractAbi, contractAddress);
  }

  async sendSignedTransaction(transaction) {
    const {
      [this.contractKey]: { owner: from, contractAddress: to, privateKey },
    } = contractsConfig;

    const estimatedGas = await transaction.estimateGas({ from });
    const gasPrice = new BigNumber(await this.web3.eth.getGasPrice());
    const fullGasPrice = new BigNumber(gasPrice).multipliedBy(1.8).toFixed(0);
    const data = transaction.encodeABI();
    const chainId = await this.web3.eth.net.getId();

    const singedTx = await this.web3.eth.accounts.signTransaction(
      {
        from,
        to,
        gas: estimatedGas,
        data,
        gasPrice: fullGasPrice,
        chainId,
      },
      privateKey,
    );

    return await this.web3.eth.sendSignedTransaction(singedTx.rawTransaction);
  }

  async getPastEvents() {
    return this.contract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest',
    });
  }

  async getTransaction(transactionHash: string) {
    return this.web3.eth.getTransaction(transactionHash);
  }
  async getTransactionReceipt(transactionHash: string) {
    return this.web3.eth.getTransactionReceipt(transactionHash);
  }
}
