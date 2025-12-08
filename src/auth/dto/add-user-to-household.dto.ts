import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddUserToHouseholdDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
