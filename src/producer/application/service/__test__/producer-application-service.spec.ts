import { Crop, Farm, Harvest, Producer } from 'src/producer/domain/model';
import {
  InvalidCropParamException,
  InvalidProducerParamException,
} from '../../../../producer/domain/exception';
import { CreateProducerDto } from '../../dto/create-producer.dto';
import {
  ICropRepository,
  IFarmRepository,
  IHarvestRepository,
  IProducerRepository,
} from '../../repository';
import { ProducerApplicationService } from '../producer-application.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ProducerApplicationService', () => {
  let service: ProducerApplicationService;

  const mockProducerRepository: Partial<IProducerRepository> = {
    save: jest.fn(async (producer: Producer) => producer),
  };

  const mockFarmRepository: Partial<IFarmRepository> = {
    save: jest.fn().mockResolvedValue(null),
    findUnique: jest.fn(),
  };

  const mockHarvestRepository: Partial<IHarvestRepository> = {
    save: jest.fn().mockResolvedValue(null),
    findUnique: jest.fn(),
  };

  const mockCropRepository: Partial<ICropRepository> = {
    save: jest.fn().mockResolvedValue(null),
    findUnique: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerApplicationService,
        { provide: 'IProducerRepository', useValue: mockProducerRepository },
        { provide: 'IFarmRepository', useValue: mockFarmRepository },
        { provide: 'IHarvestRepository', useValue: mockHarvestRepository },
        { provide: 'ICropRepository', useValue: mockCropRepository },
      ],
    }).compile();

    service = module.get(ProducerApplicationService);
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
    mockFarmRepository.findUnique = jest.fn().mockResolvedValue(null);

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
    expect(mockFarmRepository.findUnique).toHaveBeenCalled();
    expect(mockFarmRepository.save).toHaveBeenCalled();
  });

  it('should create a producer with farm and harvest', async () => {
    mockFarmRepository.findUnique = jest.fn().mockResolvedValue(null);
    mockHarvestRepository.findUnique = jest.fn().mockResolvedValue(null);
    mockCropRepository.findUnique = jest.fn().mockResolvedValue(null);

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
    const harvest = farm.getHarvests();
    expect(harvest).toBeDefined();

    expect(mockFarmRepository.findUnique).toHaveBeenCalled();
    expect(mockFarmRepository.save).toHaveBeenCalled();

    expect(mockHarvestRepository.findUnique).toHaveBeenCalled();
    expect(mockHarvestRepository.save).toHaveBeenCalled();

    expect(mockCropRepository.findUnique).toHaveBeenCalled();
    expect(mockCropRepository.save).toHaveBeenCalled();
  });

  it('should throw when name is empty', async () => {
    const input: CreateProducerDto = {
      document: '09779679057',
      name: '',
    };

    await expect(service.create(input)).rejects.toThrow(
      InvalidProducerParamException,
    );
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

    expect(mockFarmRepository.save).toHaveBeenCalled();
    expect(mockCropRepository.save).not.toHaveBeenCalled();
    expect(mockProducerRepository.save).not.toHaveBeenCalled();
  });
});
