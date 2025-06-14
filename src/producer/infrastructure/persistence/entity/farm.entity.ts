import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ProducerEntity } from './producer.entity';
import { HarvestEntity } from './harvest.entity';

@Entity('farms')
export class FarmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column('float')
  totalArea: number;

  @Column('float')
  agriculturalArea: number;

  @Column('float')
  vegetationArea: number;

  @ManyToOne(() => ProducerEntity, (producer) => producer.farms, {
    onDelete: 'CASCADE',
  })
  producer: ProducerEntity;

  @OneToMany(() => HarvestEntity, (harvest) => harvest.farm, { cascade: true })
  harvests: HarvestEntity[];
}
