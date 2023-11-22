import { Controller, Get } from '@nestjs/common';
import { PolygonListenerService } from './polygon-listener.service';

@Controller()
export class PolygonListenerController {
  constructor(
    private readonly polygonListenerService: PolygonListenerService,
  ) {}

}
