import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

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

  async remove(id: string): Promise<boolean> {
    const deleteResult = await this.repository.delete(id);
    if (deleteResult.affected === 0) {
      return true;
    }
    return false;
  }

  async findAll(): Promise<Producer[]> {
    const producerEntities = await this.repository.find({
      relations: ['farms', 'farms.harvests', 'farms.harvests.crop'],
    });
    return producerEntities.map(ProducerMapper.toDomain);
  }

  async findById(id: string): Promise<Producer | null> {
    const producerEntity = await this.repository.findOne({
      where: { id },
      relations: ['farms', 'farms.harvests', 'farms.harvests.crop'],
    });

    if (producerEntity) {
      return ProducerMapper.toDomain(producerEntity);
    }

    return null;
  }

  async findByDocument(document: string): Promise<Producer | null> {
    const producerEntity = await this.repository.findOne({
      where: { document },
    });

    if (producerEntity) {
      return ProducerMapper.toDomain(producerEntity);
    }

    return null;
  }
}
