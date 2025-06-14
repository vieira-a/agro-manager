import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Crop } from '../../../../../producer/domain/model';
import { CropEntity } from '../../entity/crop.entity';
import { ICropRepository } from '../../../../../producer/application/repository';
import { CropMapper } from '../../mapper/crop.mapper';

@Injectable()
export class CropTypeOrmRepository implements ICropRepository {
  constructor(
    @InjectRepository(CropEntity)
    private readonly repository: Repository<CropEntity>,
  ) {}

  async save(crop: Crop): Promise<Crop> {
    const cropEntity = CropMapper.toEntity(crop);

    const savedCrop = await this.repository.save(cropEntity);
    return CropMapper.toDomain(savedCrop);
  }

  async findUnique(name: string): Promise<Crop | null> {
    const cropEntity = await this.repository.findOne({ where: { name } });

    if (cropEntity) {
      return CropMapper.toDomain(cropEntity);
    }

    return null;
  }
}
