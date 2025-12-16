import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { NotificationsService } from './notifications.service';
import { InvitationEventDto } from './dto/invitaions-event.dto';
import { ConfigService } from '@nestjs/config';
import { kafkaTopics } from '@app/common';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger = new Logger(KafkaConsumerService.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {
    this.kafka = new Kafka({
      clientId: 'household-app-server',
      brokers: [`${this.configService.get<string>('BROKER_URI')}`],
    });
    this.consumer = this.kafka.consumer({ groupId: 'household-invites-group' });
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }

  private async connect() {
    try {
      await this.consumer.connect();
      this.logger.log('Kafka Consumer connected successfully');

      await this.consumer.subscribe({
        topic: kafkaTopics.HOUSEHOLD_INVITES,
        fromBeginning: true,
      });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          if (!message.value) return;

          const payloadString = message.value.toString();
          this.logger.debug(`Received Kafka message: ${payloadString}`);

          try {
            const payload: InvitationEventDto = JSON.parse(payloadString);
            this.notificationsService.broadcastNotification(payload);
          } catch (error) {
            this.logger.error('Failed to parse Kafka message', error);
          }
        },
      });
    } catch (error) {
      this.logger.error('Error connecting to Kafka', error);
    }
  }
}
