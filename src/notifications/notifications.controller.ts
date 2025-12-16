import { Controller, Sse, Query, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Sse('stream')
  streamNotifications(
    @Query('userName') userName: string,
  ): Observable<MessageEvent> {
    return this.notificationsService.getUserStream(userName);
  }
}
