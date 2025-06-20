import { Module } from '@nestjs/common';
import {
  ProducerTypeOrmRepository,
  FarmTypeOrmRepository,
  HarvestTypeOrmRepository,
  CropTypeOrmRepository,
} from './infrastructure/persistence/repository/typeorm';
import { ProducerApplicationService } from './application/service/producer-application.service';
import { AppTypeOrmModule } from '../shared/infrastructure/persistence/typeorm/typeorm.module';
import { ProducerController } from './web/rest/controller/producer.controller';

@Module({
  imports: [AppTypeOrmModule],
  providers: [
    ProducerApplicationService,
    { provide: 'IProducerRepository', useClass: ProducerTypeOrmRepository },
    { provide: 'IFarmRepository', useClass: FarmTypeOrmRepository },
    { provide: 'IHarvestRepository', useClass: HarvestTypeOrmRepository },
    { provide: 'ICropRepository', useClass: CropTypeOrmRepository },
  ],
  controllers: [ProducerController],
  exports: [ProducerApplicationService],
})
export class ProducerModule {}
