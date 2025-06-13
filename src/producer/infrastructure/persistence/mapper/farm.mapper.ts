import { CreateFarmResponse } from '../../../../producer/web/rest/dto/response/create-producer.response';
import { Farm } from '../../../../producer/domain/model';
import { FarmEntity } from '../entity/farm.entity';
import { HarvestMapper } from './harvest.mapper';

export class FarmMapper {
  static toDomain(entity: FarmEntity): Farm {
    const harvest = entity.harvests?.[0]
      ? HarvestMapper.toDomain(entity.harvests[0])
      : undefined;

    return Farm.restore({
      id: entity.id,
      name: entity.name,
      city: entity.city,
      state: entity.state,
      totalArea: entity.totalArea,
      agriculturalArea: entity.agriculturalArea,
      vegetationArea: entity.vegetationArea,
      harvest,
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

    const harvest = domain.getHarvest();
    entity.harvests = harvest ? [HarvestMapper.toEntity(harvest)] : [];

    return entity;
  }

  static toResponse(farm: Farm): CreateFarmResponse {
    return {
      name: farm.getName(),
      city: farm.getCity(),
      state: farm.getState(),
      totalArea: farm.getTotalArea(),
      agriculturalArea: farm.getAgriculturalArea(),
      vegetationArea: farm.getVegetationArea(),
      harvest: farm.getHarvest()
        ? HarvestMapper.toResponse(farm.getHarvest()!)
        : undefined,
    };
  }
}
