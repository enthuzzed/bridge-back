import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { IRossetaTransactionResponse } from "@app/rosseta-api/interfaces/rosseta.interface";

@Injectable()
export class RossetaApiService {

  constructor(private httpService: HttpService) {
  }

  async getUserTransaction(
    address: string,
  ): Promise<IRossetaTransactionResponse> {
    const response = await lastValueFrom(
      this.httpService.post(`https://rosetta-api.internetcomputer.org/search/transactions`,
        {
          network_identifier: {
            blockchain: 'Internet Computer',
            network: '00000000000000020101',
          },
          account_identifier: {
            address: address
          },
        }
      )
    );
    return response?.data;
  }
}
