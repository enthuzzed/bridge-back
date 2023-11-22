import { readFile } from 'fs/promises';
import { AbiItem } from 'web3-utils';
import path from 'path';
import { Web3AbiLoaderInterface } from '../interfaces';

export class Web3AbiLoader implements Web3AbiLoaderInterface {
  constructor(readonly directory: string) {}

  async getAbi(contractAddress: string): Promise<AbiItem | AbiItem[]> {
    const abiFileName = `${contractAddress}.abi.json`;

    const pathFile = path.join(path.resolve('./'), this.directory, abiFileName);
    const fileData = await readFile(pathFile, 'utf-8');

    return JSON.parse(fileData);
  }
}
