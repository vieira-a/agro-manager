import { Producer } from '../../../producer/domain/model';

export interface IProducerRepository {
  save(producer: Producer): Promise<Producer>;
}
