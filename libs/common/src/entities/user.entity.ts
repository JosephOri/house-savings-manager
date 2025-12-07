import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Household } from '@app/common/entities/household.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ManyToOne(() => Household, (household) => household.participants)
  household: Household;
}
