import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { InvitationEventDto } from './dto/invitaions-event.dto';
import { ConfigService } from '@nestjs/config';
import { kafkaTopics, User } from '@app/common';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger = new Logger(KafkaProducerService.name);

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'household-app-producer',
      brokers: [`${this.configService.get<string>('BROKER_URI')}`],
    });

    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  private async connect() {
    try {
      await this.producer.connect();
      this.logger.log('Kafka Producer connected successfully');
    } catch (error) {
      this.logger.error('Error connecting Kafka Producer', error);
    }
  }

  async sendHouseholdInvitation(payload: InvitationEventDto, user: User) {
    try {
      await this.producer.send({
        topic: kafkaTopics.HOUSEHOLD_INVITES,
        messages: [
          {
            key: payload.targetUserName,
            value: JSON.stringify({
              ...payload,
              message: `${user.userName} has invited you to collaborate on a household`,
              id: crypto.randomUUID().toString(),
            }),
          },
        ],
      });
      this.logger.log(
        `Sent invitation to Kafka for user: ${payload.targetUserName}`,
      );
    } catch (error) {
      this.logger.error('Error sending message to Kafka', error);
      throw error;
    }
  }
}
