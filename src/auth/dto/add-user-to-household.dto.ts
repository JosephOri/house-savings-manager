import { IsNotEmpty, IsString } from 'class-validator';

export class AddUserToHouseholdDto {
  @IsString()
  @IsNotEmpty()
  targetUserName: string;

  @IsString()
  @IsNotEmpty()
  adminId: string;
}
