import { IsString } from 'class-validator';

export class InvitationEventDto {
  @IsString()
  adminId: string;

  @IsString()
  targetUserName: string;

  @IsString()
  householdId: string;
}
