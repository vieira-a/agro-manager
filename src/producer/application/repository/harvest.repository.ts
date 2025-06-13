import { Harvest } from '../../domain/model';

export interface IHarvestRepository {
  findUnique(description: string, year: number): Promise<Harvest | null>;
  save(harvest: Harvest): Promise<Harvest>;
}
