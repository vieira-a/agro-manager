import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { FarmEntity } from './farm.entity';

@Entity({ name: 'producers' })
export class ProducerEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  document: string;

  @Column()
  password: string;

  @OneToMany(() => FarmEntity, (farm) => farm.producer, { cascade: true })
  farms: FarmEntity[];
}
