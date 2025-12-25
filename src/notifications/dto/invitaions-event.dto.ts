import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InvitationEventDto {
  @ApiProperty({ example: 'admin-uuid', description: 'Admin user ID' })
  @IsString()
  adminId: string;

  @ApiProperty({ example: 'israel_123', description: 'Target username' })
  @IsString()
  targetUserName: string;

  @ApiProperty({ example: 'household-uuid', description: 'Household ID' })
  @IsString()
  householdId: string;
}
