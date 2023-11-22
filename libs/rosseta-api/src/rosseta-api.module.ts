import { HttpModule} from '@nestjs/axios';
import { RossetaApiService } from './rosseta-api.service';
import { Module } from "@nestjs/common";

@Module({
  imports: [HttpModule.register({})],
  providers: [RossetaApiService],
  exports: [RossetaApiService],
})
export class RossetaApiModule {}
