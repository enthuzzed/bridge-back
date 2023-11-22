import path from 'path';
import { DfinityDidLoaderInterface } from '../interfaces';

export class DfinityDidLoader implements DfinityDidLoaderInterface {
  constructor(readonly directory: string) {}

  async getDid(contractAddress: string): Promise<any> {
    const abiFileName = `${contractAddress}.did.ts`;

    const pathFile = path.join(path.resolve('./'), this.directory, abiFileName);
    import(this.directory + '/' + abiFileName).then((module) => {
      return module;
    });
  }
}
