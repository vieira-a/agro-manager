import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CropEntity,
  FarmEntity,
  HarvestEntity,
  ProducerEntity,
} from '../../../../producer/infrastructure/persistence/entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProducerEntity,
      HarvestEntity,
      FarmEntity,
      CropEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class AppTypeOrmModule {}
