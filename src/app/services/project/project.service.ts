import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponseInterface } from '../../interfaces/paginated-response.interface';
import {
  ForkedProjectInterface,
  ProjectInterface,
} from '../../interfaces/project.interface';
import { CreateProjectInterface } from '../../interfaces/create-project.interface';
import { MessageInterface } from '../../interfaces/message.interface';
import { MemberInterface } from '../../interfaces/member.interface';
import { EnvService } from '../env/env.service';
import { omitBy } from '../../utils/object.utils';
import { ImportSwaggerInterface } from 'src/app/interfaces/import-swagger.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private httpClient: HttpClient, private envService: EnvService) {}

  getProjects(
    page = 1,
    perPage = 10,
    sortBy?: string,
    direction?: string,
    onlyBranches?: string
  ) {
    return this.httpClient.get<
      PaginatedResponseInterface<ForkedProjectInterface>
    >(`${this.envService.getEnv('apiUrl')}/projects`, {
      params: omitBy(
        { page, perPage, sortBy, onlyBranches, direction },
        undefined
      ),
    });
  }

  getMemberList(projectId: number, page = 1, perPage = 10) {
    return this.httpClient.get<PaginatedResponseInterface<MemberInterface>>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/members`,
      {
        params: { page, perPage },
      }
    );
  }

  getProject(id: number) {
    return this.httpClient.get<ProjectInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${id}`
    );
  }

  createProject(data: CreateProjectInterface) {
    return this.httpClient.post<ProjectInterface>(
      `${this.envService.getEnv('apiUrl')}/projects`,
      data
    );
  }

  editProject(id: number, data: CreateProjectInterface) {
    return this.httpClient.put<ProjectInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${id}`,
      data
    );
  }

  deleteProject(id: number) {
    return this.httpClient.delete<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${id}`
    );
  }

  inviteToProject(projectId: number, email: string) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv(
        'apiUrl'
      )}/projects/${projectId}/invite/${email}`,
      undefined
    );
  }

  forkProject(projectId: number, data: CreateProjectInterface) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/fork`,
      data
    );
  }

  leaveProject(projectId: number) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/leave`,
      undefined
    );
  }

  importSwagger(projectId: number, data: ImportSwaggerInterface) {
    return this.httpClient.post<any>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/swagger`,
      data
    );
  }
}
