import { Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { CurrentUser, JwtAuthGuard, User } from '@app/common';
import { InvitationEventDto } from 'src/notifications/dto/invitaions-event.dto';
import { KafkaProducerService } from 'src/notifications/kafka-producer.service';
import { Logger } from 'nestjs-pino';

@Controller('household')
export class HouseholdController {
  constructor(
    private readonly householdService: HouseholdService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: User) {
    return await this.householdService.create(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.householdService.findAll();
  }

  @Post('invite')
  @UseGuards(JwtAuthGuard)
  async inviteUser(
    @Body() inviteData: InvitationEventDto,
    @CurrentUser() user: User,
  ) {
    this.logger.log(
      `Creating invite for user ${inviteData.targetUserName} to household ${inviteData.householdId}`,
    );

    await this.kafkaProducerService.sendHouseholdInvitation(inviteData, user);
  }
}
