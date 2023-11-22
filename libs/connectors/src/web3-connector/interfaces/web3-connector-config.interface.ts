import { Web3ConnectionTypeEnum } from '../enums';

export interface Web3ConnectorConfigInterface {
  readonly url: string;
  readonly connectionType: Web3ConnectionTypeEnum;
}
