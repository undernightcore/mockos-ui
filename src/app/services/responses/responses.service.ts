import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ResponseInterface,
  SimpleResponseInterface,
} from '../../interfaces/response.interface';
import { CreateResponseInterface } from '../../interfaces/create-response.interface';
import { MessageInterface } from '../../interfaces/message.interface';
import { map } from 'rxjs';
import { ResponseModel } from '../../models/response.model';
import { EnvService } from '../env/env.service';
import { ProcessorInterface } from '../../interfaces/processor.interface';
import { EditProcessorInterface } from '../../interfaces/edit-processor.interface';

@Injectable({
  providedIn: 'root',
})
export class ResponsesService {
  constructor(private httpClient: HttpClient, private envService: EnvService) {}

  getResponses(routeId: number, page = 1, perPage = 10) {
    return this.httpClient.get<Array<SimpleResponseInterface>>(
      `${this.envService.getEnv('apiUrl')}/routes/${routeId}/responses`,
      {
        params: { page, perPage },
      }
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

  enableResponse(responseId: number) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/responses/${responseId}/enable`,
      {}
    );
  }

  deleteResponse(responseId: number) {
    return this.httpClient.delete<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/responses/${responseId}`
    );
  }

  deleteSelectedResponses(responseIds: number[]) {
    return this.httpClient.delete(
      `${this.envService.getEnv('apiUrl')}/responses/${responseIds}`
    );
  }

  duplicateResponse(responseId: number, name: string) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/responses/${responseId}/duplicate`,
      { name }
    );
  }

  getProcessor(responseId: number) {
    return this.httpClient.get<ProcessorInterface>(
      `${this.envService.getEnv('apiUrl')}/responses/${responseId}/processor`
    );
  }

  editProcessor(responseId: number, data: EditProcessorInterface) {
    return this.httpClient.post<void>(
      `${this.envService.getEnv('apiUrl')}/responses/${responseId}/processor`,
      data
    );
  }
}
