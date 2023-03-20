import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResponseInterface } from '../interfaces/paginated-response.interface';
import { InvitationInterface } from '../interfaces/invitation.interface';
import { MessageInterface } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getInvitations(page = 1, perPage = 10) {
    return this.httpClient.get<PaginatedResponseInterface<InvitationInterface>>(
      `${environment.apiUrl}/invitations`,
      { params: { page, perPage } }
    );
  }

  acceptInvitation(invitationId: number) {
    return this.httpClient.post<MessageInterface>(
      `${environment.apiUrl}/invitations/${invitationId}`,
      {}
    );
  }
}
