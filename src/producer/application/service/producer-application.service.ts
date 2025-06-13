import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProducerDto } from '../dto/create-producer.dto';
import {
  Producer,
  Crop,
  Farm,
  Harvest,
  DocumentValidatorFactory,
} from '../../../producer/domain/model';
import {
  IProducerRepository,
  IFarmRepository,
  IHarvestRepository,
  ICropRepository,
} from '../repository';

@Injectable()
export class ProducerApplicationService {
  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
    @Inject('IFarmRepository')
    private readonly farmRepository: IFarmRepository,
    @Inject('IHarvestRepository')
    private readonly harvestRepository: IHarvestRepository,
    @Inject('ICropRepository')
    private readonly cropRepository: ICropRepository,
  ) {}

  async create(input: CreateProducerDto): Promise<Producer> {
    const producerDocument = DocumentValidatorFactory.create(input.document);

    const producer = Producer.create({
      document: producerDocument,
      name: input.name,
    });

    if (input.farm) {
      const farmProps = input.farm;

      let farm = await this.farmRepository.findUnique(
        farmProps.name,
        farmProps.city,
        farmProps.state,
      );

      if (!farm) {
        farm = Farm.create({
          name: farmProps.name,
          city: farmProps.city,
          state: farmProps.state,
          totalArea: farmProps.totalArea,
          agriculturalArea: farmProps.agriculturalArea,
          vegetationArea: farmProps.vegetationArea,
        });

        await this.farmRepository.save(farm);
      }

      if (farmProps.harvest) {
        const harvestProps = farmProps.harvest;
        const cropProps = harvestProps.crop;

        let harvest = await this.harvestRepository.findUnique(
          harvestProps.description,
          harvestProps.year,
        );

        if (!harvest) {
          let crop = await this.cropRepository.findUnique(cropProps.name);

          if (!crop) {
            crop = Crop.create({ name: cropProps.name });
            await this.cropRepository.save(crop);
          }

          harvest = Harvest.create({
            description: harvestProps.description,
            year: harvestProps.year,
            crop,
          });

          await this.harvestRepository.save(harvest);
        }

        farm.addHarvest(harvest);
      }

      producer.addFarm(farm);
    }

    return this.producerRepository.save(producer);
  }

  async delete(id: string): Promise<boolean> {
    return await this.producerRepository.remove(id);
  }

  async findAll(): Promise<Producer[]> {
    return await this.producerRepository.findAll();
  }

  async findById(id: string): Promise<Producer | null> {
    return await this.producerRepository.findById(id);
  }

  async updateName(id: string, newName: string): Promise<void> {
    const producer = await this.producerRepository.findById(id);

    if (!producer) {
      throw new NotFoundException(`Produtor com id ${id} não encontrado`);
    }

    producer.updateName(newName);
    await this.producerRepository.save(producer);
  }
}
