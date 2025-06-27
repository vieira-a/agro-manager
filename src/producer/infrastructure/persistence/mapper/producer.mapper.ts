import { ProducerResponse } from '../../../web/rest/dto/response/producer.response';
import {
  CPF,
  DocumentValidatorFactory,
  Producer,
} from '../../../../producer/domain/model';
import { ProducerEntity } from '../entity/producer.entity';
import { FarmMapper } from './farm.mapper';
import { Password } from 'src/producer/domain/model/password';

export class ProducerMapper {
  static toEntity(domain: Producer): ProducerEntity {
    const entity = new ProducerEntity();
    entity.id = domain.getId();
    entity.document = domain.getDocument();
    entity.name = domain.getName();
    entity.password = domain.getPassword();
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
      password: new Password(entity.password),
    });
  }

  static toResponse(domain: Producer): ProducerResponse {
    return {
      id: domain.getId(),
      document: domain.getDocument(),
      name: domain.getName(),
      farms: domain.getFarms().map((farm) => FarmMapper.toResponse(farm)),
    };
  }
}
