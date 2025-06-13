import { Crop } from '../../domain/model';

export interface ICropRepository {
  findUnique(name: string): Promise<Crop | null>;
  save(crop: Crop): Promise<Crop>;
}
