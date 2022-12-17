import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from '.';

@Entity()
export class Authority {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    default: '',
  })
  name: string;

  @ManyToMany((type) => Role, (roles) => roles._id, { cascade: true })
  roles: Role[];
}
