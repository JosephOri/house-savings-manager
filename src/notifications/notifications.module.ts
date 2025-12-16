import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { KafkaConsumerService } from './kafka-consumer.service';
import { NotificationsController } from './notifications.controller';
import { KafkaProducerService } from './kafka-producer.service';

@Module({
  providers: [NotificationsService, KafkaConsumerService, KafkaProducerService],
  controllers: [NotificationsController],
  exports: [NotificationsService, KafkaConsumerService, KafkaProducerService],
})
export class NotificationsModule {}
