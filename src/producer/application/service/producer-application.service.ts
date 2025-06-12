import { Injectable } from '@nestjs/common';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { Producer } from '../../../producer/domain/model/producer';
import { DocumentValidatorFactory } from '../../../producer/domain/model/document-validator.factory';
import { Farm } from '../../../producer/domain/model/farm';
import { Harvest } from '../../../producer/domain/model/harvest';
import { Crop } from '../../../producer/domain/model/crop';

@Injectable()
export class ProducerApplicationService {
  async create(input: CreateProducerDto): Promise<Producer> {
    const producerDocument = DocumentValidatorFactory.create(input.document);

    const producer = Producer.create({
      document: producerDocument,
      name: input.name,
    });

    if (input.farm) {
      const farmProps = input.farm;
      const farm = Farm.create({
        name: farmProps.name,
        city: farmProps.city,
        state: farmProps.state,
        totalArea: farmProps.totalArea,
        agriculturalArea: farmProps.agriculturalArea,
        vegetationArea: farmProps.vegetationArea,
      });

      if (farmProps.harvest) {
        const harvestProps = farmProps.harvest;
        const cropProps = harvestProps.crop;

        const crop = Crop.create({
          name: cropProps.name,
        });

        const harvest = Harvest.create({
          description: harvestProps.description,
          year: harvestProps.year,
          crop: crop,
        });

        farm.addHarvest(harvest);
      }

      producer.addFarm(farm);
    }

    return producer;
  }
}
