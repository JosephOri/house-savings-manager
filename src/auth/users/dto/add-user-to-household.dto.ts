import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserToHouseholdDto {
  @ApiProperty({ example: 'israel_123', description: 'Target username' })
  @IsString()
  targetUserName: string;

  @ApiProperty({ example: 'admin-uuid', description: 'Admin user ID' })
  @IsString()
  adminId: string;
}
