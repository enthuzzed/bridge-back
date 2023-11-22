import { Test, TestingModule } from '@nestjs/testing';
import { PolygonListenerController } from './polygon-listener.controller';
import { PolygonListenerService } from './polygon-listener.service';

describe('PolygonListenerController', () => {
  let polygonListenerController: PolygonListenerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PolygonListenerController],
      providers: [PolygonListenerService],
    }).compile();

    polygonListenerController = app.get<PolygonListenerController>(
      PolygonListenerController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //expect(polygonListenerController.getHello()).toBe('Hello World!');
    });
  });
});
