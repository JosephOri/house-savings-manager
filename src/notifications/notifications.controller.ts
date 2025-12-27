import { Controller, Sse, Query, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Sse('stream')
  @ApiOperation({ summary: 'Stream notifications' })
  @ApiResponse({ status: 200, description: 'Notification stream.' })
  streamNotifications(
    @Query('userName') userName: string,
  ): Observable<MessageEvent> {
    return this.notificationsService.getUserStream(userName);
  }
}
