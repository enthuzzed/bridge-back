export interface DfinityDidLoaderInterface {
  getDid(contractAddress: string): Promise<any>;
}
