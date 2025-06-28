import { Module } from '@nestjs/common';
import {
  ProducerTypeOrmRepository,
  FarmTypeOrmRepository,
  HarvestTypeOrmRepository,
  CropTypeOrmRepository,
} from './infrastructure/persistence/repository/typeorm';
import { ProducerApplicationService } from './application/service';
import { AppTypeOrmModule } from '../shared/infrastructure/persistence/typeorm/typeorm.module';
import { ProducerController } from './web/rest/controller/producer.controller';
import { EncryptPassword } from './domain/model/encrypt-password';
import { PasswordFactory } from './domain/model/password.factory';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../shared/auth/strategy/jwt.strategy';

@Module({
  imports: [AppTypeOrmModule],
  providers: [
    ProducerApplicationService,
    JwtStrategy,
    JwtService,
    PasswordFactory,
    { provide: 'IProducerRepository', useClass: ProducerTypeOrmRepository },
    { provide: 'IFarmRepository', useClass: FarmTypeOrmRepository },
    { provide: 'IHarvestRepository', useClass: HarvestTypeOrmRepository },
    { provide: 'ICropRepository', useClass: CropTypeOrmRepository },
    { provide: 'Encrypter', useClass: EncryptPassword },
  ],
  controllers: [ProducerController],
  exports: [ProducerApplicationService, PasswordFactory, 'Encrypter'],
})
export class ProducerModule {}
