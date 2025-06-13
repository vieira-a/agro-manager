import { CreateCropResponse } from '../../../../producer/web/rest/dto/response/create-producer.response';
import { Crop } from '../../../../producer/domain/model';
import { CropEntity } from '../entity/crop.entity';

export class CropMapper {
  static toDomain(entity: CropEntity): Crop {
    return Crop.restore({ id: entity.id, name: entity.name });
  }

  static toEntity(domain: Crop): CropEntity {
    const entity = new CropEntity();
    entity.id = domain.getId();
    entity.name = domain.getName();
    return entity;
  }

  static toResponse(crop: Crop): CreateCropResponse {
    return {
      name: crop.getName(),
    };
  }
}
