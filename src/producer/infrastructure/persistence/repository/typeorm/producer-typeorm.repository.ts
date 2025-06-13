import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Producer } from '../../../../../producer/domain/model';
import { ProducerEntity } from '../../entity/producer.entity';
import { IProducerRepository } from '../../../../../producer/application/repository';

@Injectable()
export class ProducerTypeOrmRepository implements IProducerRepository {
  constructor(
    @InjectRepository(ProducerEntity)
    private readonly repository: Repository<ProducerEntity>,
  ) {}

  async save(producer: Producer): Promise<Producer> {
    return producer;
  }
}
