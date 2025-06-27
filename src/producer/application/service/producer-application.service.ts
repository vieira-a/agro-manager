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
import { ProducerSummary } from '../dto/producer-summary';
import { PasswordFactory } from '../../../producer/domain/model/password.factory';
import { PasswordNotMatchException } from '../exception/password-not-match.exception';

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
    private readonly passwordFactory: PasswordFactory,
  ) {}

  async create(input: CreateProducerDto): Promise<Producer> {
    if (input.password !== input.passwordConfirmation) {
      throw new PasswordNotMatchException();
    }

    const producerDocument = DocumentValidatorFactory.create(input.document);
    const hashedPassword = await this.passwordFactory.create(input.password);

    const producer = Producer.create({
      document: producerDocument,
      name: input.name,
      password: hashedPassword,
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
          harvests: [],
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

        farm = Farm.restore({
          id: farm.getId(),
          name: farm.getName(),
          city: farm.getCity(),
          state: farm.getState(),
          totalArea: farm.getTotalArea(),
          agriculturalArea: farm.getAgriculturalArea(),
          vegetationArea: farm.getVegetationArea(),
          harvests: [...farm.getHarvests(), harvest],
        });
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

  async findByDocument(document: string): Promise<Producer | null> {
    return await this.producerRepository.findByDocument(document);
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

  async getSummary(): Promise<any> {
    const producers = await this.producerRepository.findAll();
    const summary = ProducerSummary.buid(producers);

    return summary.toJSON();
  }
}
