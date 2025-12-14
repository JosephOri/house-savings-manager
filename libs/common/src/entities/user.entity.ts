import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({ unique: true })
  @IsString()
  userName: string;

  @Column({ select: false })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Column({ nullable: true })
  householdId: string;

  @ManyToOne(() => Household, (household) => household.participants)
  @JoinColumn({ name: 'householdId' })
  household: Household;
}
