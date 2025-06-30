import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { FarmEntity } from './farm.entity';
import { ProducerRole } from 'src/producer/domain/enum/producer-role.enum';

@Entity({ name: 'producers' })
export class ProducerEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  role: ProducerRole;

  @Column()
  document: string;

  @Column()
  password: string;

  @OneToMany(() => FarmEntity, (farm) => farm.producer, { cascade: true })
  farms: FarmEntity[];
}
