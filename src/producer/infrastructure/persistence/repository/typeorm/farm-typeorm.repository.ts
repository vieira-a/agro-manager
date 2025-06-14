import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Farm } from '../../../../../producer/domain/model';
import { FarmEntity } from '../../entity/farm.entity';
import { IFarmRepository } from '../../../../../producer/application/repository';
import { FarmMapper } from '../../mapper/farm.mapper';

@Injectable()
export class FarmTypeOrmRepository implements IFarmRepository {
  constructor(
    @InjectRepository(FarmEntity)
    private readonly repository: Repository<FarmEntity>,
  ) {}

  async save(farm: Farm): Promise<Farm> {
    const farmEntity = FarmMapper.toEntity(farm);

    const savedFarm = await this.repository.save(farmEntity);
    return FarmMapper.toDomain(savedFarm);
  }

  async findUnique(
    name: string,
    city: string,
    state: string,
  ): Promise<Farm | null> {
    const farmEntity = await this.repository.findOne({
      where: { name, city, state },
    });

    if (farmEntity) {
      return FarmMapper.toDomain(farmEntity);
    }

    return null;
  }
}
