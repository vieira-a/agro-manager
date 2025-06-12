import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { FarmEntity } from './farm.entity';
import { CropEntity } from './crop.entity';

@Entity('harvests')
export class HarvestEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  year: number;

  @ManyToOne(() => FarmEntity, (farm) => farm.harvests)
  farm: FarmEntity;

  @ManyToOne(() => CropEntity, (crop) => crop.harvests, { cascade: true })
  crop: CropEntity;
}
