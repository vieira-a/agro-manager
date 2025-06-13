import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Harvest } from '../../../../../producer/domain/model';
import { HarvestEntity } from '../../entity/harvest.entity';
import { IHarvestRepository } from '../../../../../producer/application/repository';
import { HarvestMapper } from '../../mapper/harvest.mapper';

@Injectable()
export class HarvestTypeOrmRepository implements IHarvestRepository {
  constructor(
    @InjectRepository(HarvestEntity)
    private readonly repository: Repository<HarvestEntity>,
  ) {}

  async save(harvest: Harvest): Promise<Harvest> {
    const harvestEntity = HarvestMapper.toEntity(harvest);

    const savedHarvest = await this.repository.save(harvestEntity);
    return HarvestMapper.toDomain(savedHarvest);
  }

  async findUnique(description: string, year: number): Promise<Harvest | null> {
    const harvestEntity = await this.repository.findOne({
      where: { description, year },
    });

    if (harvestEntity) {
      return HarvestMapper.toDomain(harvestEntity);
    }

    return null;
  }
}
