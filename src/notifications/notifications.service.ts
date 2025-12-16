import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { InvitationEventDto } from './dto/invitaions-event.dto';

@Injectable()
export class NotificationsService {
  private readonly eventsSubject = new Subject<InvitationEventDto>();

  broadcastNotification(payload: InvitationEventDto) {
    this.eventsSubject.next(payload);
  }

  getUserStream(userName: string): Observable<MessageEvent> {
    return this.eventsSubject.asObservable().pipe(
      filter((event) => event.targetUserName === userName),
      map(
        (event) =>
          ({
            data: event,
          }) as MessageEvent,
      ),
    );
  }
}
