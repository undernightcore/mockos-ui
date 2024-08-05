import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, shareReplay, switchMap, tap } from 'rxjs';
import { RealtimeType } from '../../interfaces/realtime-type.interface';
import { EnvService } from '../env/env.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  user$ = this.authService.getUser().pipe(shareReplay(1));
  socket: Socket;

  constructor(
    private envService: EnvService,
    private authService: AuthService
  ) {
    this.socket = io(this.envService.getEnv('apiUrl'));
  }

  listenProject(projectId: number) {
    return new Observable<RealtimeType>((subscriber) => {
      this.socket.on(`project:${projectId}`, (data) => {
        subscriber.next(data);
      });
    }).pipe(
      tap({
        unsubscribe: () =>
          this.socket.removeAllListeners(`project:${projectId}`),
      })
    );
  }

  listenRoute(routeId: number) {
    return new Observable<RealtimeType>((subscriber) => {
      this.socket.on(`route:${routeId}`, (data) => {
        subscriber.next(data);
      });
    }).pipe(
      tap({
        unsubscribe: () => this.socket.removeAllListeners(`route:${routeId}`),
      })
    );
  }

  listenResponse(responseId: number) {
    return new Observable<RealtimeType>((subscriber) => {
      this.socket.on(`response:${responseId}`, (data) => {
        subscriber.next(data);
      });
    }).pipe(
      tap({
        unsubscribe: () =>
          this.socket.removeAllListeners(`response:${responseId}`),
      })
    );
  }

  listenContract(contractId: number) {
    return new Observable<RealtimeType>((subscriber) => {
      this.socket.on(`swagger:${contractId}`, (data) => {
        subscriber.next(data);
      });
    }).pipe(
      tap({
        unsubscribe: () =>
          this.socket.removeAllListeners(`swagger:${contractId}`),
      })
    );
  }

  listenUserInvitations() {
    return this.user$.pipe(
      switchMap(({ id }) =>
        new Observable<RealtimeType>((subscriber) => {
          this.socket.on(`invitations:${id}`, (data) => {
            subscriber.next(data);
          });
        }).pipe(
          tap({
            unsubscribe: () =>
              this.socket.removeAllListeners(`invitations:${id}`),
          })
        )
      )
    );
  }

  listenUserProjects() {
    return this.user$.pipe(
      switchMap(({ id }) =>
        new Observable<RealtimeType>((subscriber) => {
          this.socket.on(`projects:${id}`, (data) => {
            subscriber.next(data);
          });
        }).pipe(
          tap({
            unsubscribe: () => this.socket.removeAllListeners(`projects:${id}`),
          })
        )
      )
    );
  }
}
