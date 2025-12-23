import { IsString } from 'class-validator';

export class AddUserToHouseholdDto {
  @IsString()
  targetUserName: string;

  @IsString()
  adminId: string;
}
