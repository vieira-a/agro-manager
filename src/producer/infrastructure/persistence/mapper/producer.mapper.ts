import {
  CPF,
  DocumentValidatorFactory,
  Producer,
} from '../../../../producer/domain/model';
import { ProducerEntity } from '../entity/producer.entity';
import { FarmMapper } from './farm.mapper';

export class ProducerMapper {
  static toEntity(domain: Producer): ProducerEntity {
    const entity = new ProducerEntity();
    entity.id = domain.getId();
    entity.document = domain.getDocument();
    entity.name = domain.getName();
    entity.farms = domain.getFarms().map(FarmMapper.toEntity);
    return entity;
  }

  static toDomain(entity: ProducerEntity): Producer {
    const document = DocumentValidatorFactory.create(entity.document);

    const farms = entity.farms?.map(FarmMapper.toDomain) ?? [];

    return Producer.restore({
      id: entity.id,
      name: entity.name,
      document,
      farms,
    });
  }
}
