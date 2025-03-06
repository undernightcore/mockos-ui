import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderInterface } from '../../interfaces/header.interface';

@Injectable({
  providedIn: 'root',
})
export class AppManagerService {
  #headerData = new BehaviorSubject<HeaderInterface | undefined>({
    hideHeader: true,
  });
  headerData$ = this.#headerData.asObservable();

  setHeaderData(data?: HeaderInterface) {
    this.#headerData.next(data);
  }
}
