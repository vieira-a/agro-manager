import { Harvest } from '../../../../producer/domain/model';
import { HarvestEntity } from '../entity/harvest.entity';
import { CropMapper } from './crop.mapper';

export class HarvestMapper {
  static toDomain(entity: HarvestEntity): Harvest {
    const crop = CropMapper.toDomain(entity.crop);
    return Harvest.restore({
      id: entity.id,
      description: entity.description,
      year: entity.year,
      crop,
    });
  }

  static toEntity(domain: Harvest): HarvestEntity {
    const entity = new HarvestEntity();
    entity.id = domain.getId();
    entity.description = domain.getDescription();
    entity.year = domain.getYear();
    entity.crop = CropMapper.toEntity(domain.getCrop());
    return entity;
  }
}
