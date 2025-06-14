import { FarmResponse } from '../../../web/rest/dto/response/producer.response';
import { Farm } from '../../../../producer/domain/model';
import { FarmEntity } from '../entity/farm.entity';
import { HarvestMapper } from './harvest.mapper';

export class FarmMapper {
  static toDomain(entity: FarmEntity): Farm {
    const harvests = entity.harvests?.map(HarvestMapper.toDomain) ?? [];

    return Farm.restore({
      id: entity.id,
      name: entity.name,
      city: entity.city,
      state: entity.state,
      totalArea: entity.totalArea,
      agriculturalArea: entity.agriculturalArea,
      vegetationArea: entity.vegetationArea,
      harvests,
    });
  }

  static toEntity(domain: Farm): FarmEntity {
    const entity = new FarmEntity();
    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.city = domain.getCity();
    entity.state = domain.getState();
    entity.totalArea = domain.getTotalArea();
    entity.agriculturalArea = domain.getAgriculturalArea();
    entity.vegetationArea = domain.getVegetationArea();

    entity.harvests = domain.getHarvests().map(HarvestMapper.toEntity) ?? [];

    return entity;
  }

  static toResponse(farm: Farm): FarmResponse {
    return {
      name: farm.getName(),
      city: farm.getCity(),
      state: farm.getState(),
      totalArea: farm.getTotalArea(),
      agriculturalArea: farm.getAgriculturalArea(),
      vegetationArea: farm.getVegetationArea(),
      harvests: farm.getHarvests().map(HarvestMapper.toResponse) ?? [],
    };
  }
}
