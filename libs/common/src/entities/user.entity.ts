import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
}
