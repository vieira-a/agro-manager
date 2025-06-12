import { InvalidCropParamException } from '../../../../producer/domain/exception';
import { CreateProducerDto } from '../../dto/create-producer.dto';
import { ProducerApplicationService } from '../producer-application.service';

describe('ProducerApplicationService', () => {
  let service: ProducerApplicationService;

  beforeEach(() => {
    service = new ProducerApplicationService();
  });

  it('should create a producer with only name and document', async () => {
    const input: CreateProducerDto = {
      name: 'João da Silva',
      document: '09779679057',
    };

    const producer = await service.create(input);

    expect(producer).toBeDefined();
    expect(producer.getFarms().length).toBe(0);
  });

  it('should create a producer with a farm', async () => {
    const input: CreateProducerDto = {
      name: 'João da Silva',
      document: '09779679057',
      farm: {
        name: 'Fazenda Monte Alto',
        city: 'Cruz das Almas',
        state: 'BA',
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
      },
    };

    const producer = await service.create(input);

    expect(producer.getFarms().length).toBe(1);
    const farm = producer.getFarms()[0];
    expect(farm.getHarvest()).toBeUndefined();
  });

  it('should create a producer with farm and harvest', async () => {
    const input: CreateProducerDto = {
      name: 'João da Silva',
      document: '09779679057',
      farm: {
        name: 'Fazenda Monte Alto',
        city: 'Cruz das Almas',
        state: 'BA',
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        harvest: {
          description: 'Safra de Milho 2025',
          year: 2025,
          crop: {
            name: 'Milho',
          },
        },
      },
    };

    const producer = await service.create(input);

    const farm = producer.getFarms()[0];
    const harvest = farm.getHarvest();
    expect(harvest).toBeDefined();
  });

  it('should throw when crop name is empty', async () => {
    const input: CreateProducerDto = {
      name: 'João da Silva',
      document: '09779679057',
      farm: {
        name: 'Fazenda Monte Alto',
        city: 'Cruz das Almas',
        state: 'BA',
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        harvest: {
          description: 'Safra de Milho 2025',
          year: 2025,
          crop: {
            name: '',
          },
        },
      },
    };

    await expect(service.create(input)).rejects.toThrow(
      InvalidCropParamException,
    );
  });
});
