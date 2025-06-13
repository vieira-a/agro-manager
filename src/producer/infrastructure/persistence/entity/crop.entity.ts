import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { HarvestEntity } from './harvest.entity';

@Entity('crops')
export class CropEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => HarvestEntity, (harvest) => harvest.crop)
  harvests: HarvestEntity[];
}
