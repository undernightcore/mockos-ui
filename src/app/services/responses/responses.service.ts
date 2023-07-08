import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponseInterface } from '../../interfaces/paginated-response.interface';
import { ResponseInterface } from '../../interfaces/response.interface';
import { CreateResponseInterface } from '../../interfaces/create-response.interface';
import { MessageInterface } from '../../interfaces/message.interface';
import { map, Observable } from 'rxjs';
import { ResponseModel } from '../../models/response.model';
import { EnvService } from '../env/env.service';

@Injectable({
  providedIn: 'root',
})
export class ResponsesService {
  constructor(private httpClient: HttpClient, private envService: EnvService) {}

  getResponses(
    routeId: number,
    page = 1,
    perPage = 10
  ): Observable<PaginatedResponseInterface<ResponseModel>> {
    return this.httpClient
      .get<PaginatedResponseInterface<ResponseInterface>>(
        `${this.envService.getEnv('apiUrl')}/routes/${routeId}/responses`,
        { params: { page, perPage } }
      )
      .pipe(
        map((responses) => ({
          data: responses.data.map((response) => new ResponseModel(response)),
          meta: responses.meta,
        }))
      );
  }

  getResponse(responseId: number) {
    return this.httpClient
      .get<ResponseInterface>(
        `${this.envService.getEnv('apiUrl')}/responses/${responseId}`
      )
      .pipe(map((response) => new ResponseModel(response)));
  }

  createResponse(
    routeId: number,
    data: CreateResponseInterface | FormData,
    isFile: boolean
  ) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/routes/${routeId}/responses`,
      data,
      isFile ? { params: { isFile } } : undefined
    );
  }

  editResponse(
    responseId: number,
    data: CreateResponseInterface | FormData,
    isFile: boolean
  ) {
    return this.httpClient.put<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/responses/${responseId}`,
      data,
      isFile ? { params: { isFile } } : undefined
    );
  }

  deleteResponse(responseId: number) {
    return this.httpClient.delete<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/responses/${responseId}`
    );
  }
}
