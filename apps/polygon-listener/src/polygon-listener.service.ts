import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { WEB3_PROVIDER } from '@app/constants';
import Web3 from 'web3';
import { DfinityBridgeContract, PolygonBridgeContract } from '@app/connectors';
import { TransactionDaoService } from '@app/dao/transaction-dao/transaction.service';
import { BlockchainTypeEnum, TransactionStateEnum } from '@app/entitie';
import BigNumber from 'bignumber.js';
import { DfinityTokenContract } from '@app/connectors/dfinity-connector/dfinity-token.contract';

@Injectable()
export class PolygonListenerService implements OnApplicationBootstrap {
  constructor(
    @Inject(WEB3_PROVIDER) private web3: Web3,
    private readonly polygonBridgeContract: PolygonBridgeContract,
    private readonly dfinityBridgeContract: DfinityBridgeContract,
    private readonly dfinityTokenContract: DfinityTokenContract,
    private readonly transactionDaoService: TransactionDaoService,
  ) {}

  onApplicationBootstrap() {
    this.subscribeRequestBridgingToStart();
    this.subscribeBridgingToEndPerformed();
  }
  /*

   */

  async subscribeRequestBridgingToStart(): Promise<void> {
    //this.polygonBridgeContract.requestBridgingToStart(1000, 'lx3mu-7lhm7-czzou-2xmsh-m2jgt-uja5g-g2v5q-nz4tu-p2qut-ykv7o-7ae');
    this.polygonBridgeContract
      .listenRequestBridgingToStart()
      .on('connected', (subscriptionId) => {
        console.log(`Connected to ${subscriptionId} subscription id.`);
      })
      .on('data', async (event) => {
        console.log(event.returnValues);
        const { _token, _from, _to, _amount } = event.returnValues;
        console.log(
          `Gotta send event: ${event.event} at tx: ${event.transactionHash}`,
        );

        const dto = {
          sender: _from,
          senderType: BlockchainTypeEnum.POLYGON,
          amount: String(_amount),
          recipient: _to,
          recipientType: BlockchainTypeEnum.DFINITY,
          state: TransactionStateEnum.IN_PROGRESS,
          polygonTransactionId: event.transactionHash,
        };
        const transaction =
          await this.transactionDaoService.findOneByPolygonTransaction(
            event.transactionHash,
          );
        if (transaction) {
          return;
        }

        const tr = await this.transactionDaoService.create(dto);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dto.id = tr.identifiers[0].id;

        //const fee = await this.dfinityTokenContract.getFee();

        //const amount = new BigNumber(_amount).multipliedBy(
        //  100 - 0.1 * Number(fee),
        //);

        const dfinityRes =
          await this.dfinityBridgeContract.performBridgingToStart(
            _amount,
            _to
          );

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        //if (dfinityRes.Err) {
          //dto.state = TransactionStateEnum.CANCELED;
          //await this.transactionDaoService.update(dto);
        //}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (dfinityRes.Ok) {
          dto.state = TransactionStateEnum.COMPLETED;
          await this.transactionDaoService.update(dto);
        }
      })
      .on('error', (error) => {
        console.log(error);
      });
  }

  async subscribeBridgingToEndPerformed(): Promise<void> {
    this.polygonBridgeContract
      .listenBridgingToEndPerformed()
      .on('connected', (subscriptionId) => {
        console.log(`Connected to ${subscriptionId} subscription id.`);
      })
      .on('data', async (event) => {
        console.log(event.returnValues);
        const { _token, _to, _amount } = event.returnValues;
        console.log(
          `Gotta send event: ${event.event} at tx: ${event.transactionHash}`,
        );
        const transaction =
          await this.transactionDaoService.findOneByPolygonTransaction(
            event.transactionHash,
          );
        if (transaction) {
          transaction.state = TransactionStateEnum.COMPLETED;
          await this.transactionDaoService.update(transaction);
        }
        //const res = this.dfinityBridgeContract.performBridgingToStart(_amount, 'lx3mu-7lhm7-czzou-2xmsh-m2jgt-uja5g-g2v5q-nz4tu-p2qut-ykv7o-7ae')
        //console.log(res)
      })
      .on('error', (error) => {
        console.log(error);
      });
  }
}
