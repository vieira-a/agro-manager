import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Producer } from '../../../../../producer/domain/model';
import { ProducerEntity } from '../../entity/producer.entity';
import { IProducerRepository } from '../../../../../producer/application/repository';
import { ProducerMapper } from '../../mapper/producer.mapper';

@Injectable()
export class ProducerTypeOrmRepository implements IProducerRepository {
  constructor(
    @InjectRepository(ProducerEntity)
    private readonly repository: Repository<ProducerEntity>,
  ) {}

  async save(producer: Producer): Promise<Producer> {
    const producerEntity = ProducerMapper.toEntity(producer);

    const savedProducer = await this.repository.save(producerEntity);
    return ProducerMapper.toDomain(savedProducer);
  }
}
