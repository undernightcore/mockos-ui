import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env/env.service';
import { PaginatedResponseInterface } from '../../interfaces/paginated-response.interface';
import { HeadersInterface } from '../../interfaces/headers.interface';
import { omitBy } from '../../utils/object.utils';

@Injectable({
  providedIn: 'root',
})
export class HeadersService {
  constructor(private http: HttpClient, private envService: EnvService) {}

  getHeaders(responseId: number, page = 1, perPage = 10, searchText?: string) {
    return this.http.get<PaginatedResponseInterface<HeadersInterface>>(
      `${this.envService.getEnv('apiUrl')}/responses/${responseId}/headers`,
      {
        params: omitBy({ page, perPage, searchText }, undefined),
      }
    );
  }
}
