import { Farm } from '../../../producer/domain/model';

export interface IFarmRepository {
  findUnique(name: string, city: string, state: string): Promise<Farm | null>;
  save(farm: Farm): Promise<Farm>;
}
