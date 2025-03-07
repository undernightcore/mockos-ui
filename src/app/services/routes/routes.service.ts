import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponseInterface } from '../../interfaces/paginated-response.interface';
import {
  FolderInterface,
  RouteInterface,
} from '../../interfaces/route.interface';
import { CreateRouteInterface } from '../../interfaces/create-route.interface';
import { MessageInterface } from '../../interfaces/message.interface';
import { EnvService } from '../env/env.service';
import { CreateFolderInterface } from '../../interfaces/create-folder.interface';
import { ProcessorInterface } from '../../interfaces/processor.interface';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  constructor(private httpClient: HttpClient, private envService: EnvService) {}

  getRoute(routeId: number) {
    return this.httpClient.get<RouteInterface>(
      `${this.envService.getEnv('apiUrl')}/routes/${routeId}`
    );
  }

  editRoute(routeId: number, data: CreateRouteInterface) {
    return this.httpClient.put<RouteInterface>(
      `${this.envService.getEnv('apiUrl')}/routes/${routeId}`,
      data
    );
  }

  editFolder(routeId: number, data: CreateFolderInterface) {
    return this.httpClient.put<RouteInterface>(
      `${this.envService.getEnv('apiUrl')}/routes/${routeId}`,
      data
    );
  }

  deleteRoute(routeId: number) {
    return this.httpClient.delete<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/routes/${routeId}`
    );
  }

  getRoutes(projectId: number) {
    return this.httpClient.get<Array<RouteInterface | FolderInterface>>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/routes`
    );
  }

  createRoute(projectId: number, data: CreateRouteInterface) {
    return this.httpClient.post<RouteInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/routes`,
      data
    );
  }

  createFolder(projectId: number, data: CreateFolderInterface) {
    return this.httpClient.post<RouteInterface>(
      `${this.envService.getEnv(
        'apiUrl'
      )}/projects/${projectId}/routes?isFolder=true`,
      data
    );
  }

  sortAndMoveRoute(
    projectId: number,
    what: number,
    before?: number,
    into?: number
  ) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/move`,
      { what, before: before ?? null, into: into ?? null }
    );
  }

  getProcessors(routeId: number) {
    return this.httpClient.get<Array<ProcessorInterface>>(
      `${this.envService.getEnv('apiUrl')}/routes/${routeId}/processors`
    );
  }
}
