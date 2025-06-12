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
});
