import {Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HeadersService} from "../../services/headers/headers.service";
import {filter, Subscription, tap} from "rxjs";
import {HeadersInterface} from "../../interfaces/headers.interface";
import {calculateAmountToFetch} from "../../utils/page.utils";
import {RealtimeService} from "../../services/realtime/realtime.service";
import {CreateHeaderInterface, EditHeaderInterface} from "../../interfaces/create-header.interface";
import {openToast} from "../../utils/toast.utils";

@Component({
  selector: 'app-headers-modal',
  templateUrl: './headers-modal.component.html',
  styleUrls: ['./headers-modal.component.scss'],
})
export class HeadersModalComponent implements OnInit {
  dialogRef = inject(MatDialogRef<HeadersModalComponent>);
  responseId = inject(MAT_DIALOG_DATA) as number;
  #headersService = inject(HeadersService);
  #realtimeService = inject(RealtimeService);
  editingHeaderForm = new FormGroup({
    id: new FormControl<number | undefined>(undefined),
    key: new FormControl<string | undefined>(undefined, [Validators.required]),
    value: new FormControl<string | undefined>(undefined, [
      Validators.required,
    ]),
  });
  createHeaderForm = new FormGroup({
    key: new FormControl<string>('', [Validators.required]),
    value: new FormControl<string>('', [Validators.required]),
  });
  headers?: HeadersInterface[];
  isFetchingHeaders = false;
  maxHeaders = 0;
  realtimeSubscription?: Subscription;

  ngOnInit() {
    this.getHeaders(1);
    this.#listenOnChanges();
  }

  setEditingHeader(header: HeadersInterface) {
    this.editingHeaderForm.patchValue(header);
  }

  getHeaders(page: number, perPage = 20) {
    if (this.isFetchingHeaders) return;
    this.#headersService
      .getHeaders(this.responseId, page, perPage)
      .pipe(
        tap({
          subscribe: () => (this.isFetchingHeaders = true),
          finalize: () => (this.isFetchingHeaders = false),
        })
      )
      .subscribe((headers) => {
        this.headers =
          page === 1
            ? headers.data
            : [...(this.headers ?? []), ...headers.data];
        this.maxHeaders = headers.meta.total;
      });
  }

  saveEditing() {
    if (this.editingHeaderForm.invalid) return;
    const { id, key, value } = this.editingHeaderForm
      .value as EditHeaderInterface;
    this.#headersService
      .editHeader(id, { key, value })
      .subscribe(({ message }) => {
        openToast(message, 'success');
        this.#patchLocalHeader(id, { key, value });
        this.cancelEditing();
      });
  }

  deleteHeader(headerId: number) {
    this.#headersService.deleteHeader(headerId).subscribe(({ message }) => {
      openToast(message, 'success');
    });
  }

  createHeader() {
    if (this.createHeaderForm.invalid) return;
    console.log()
    const header = this.createHeaderForm.value as CreateHeaderInterface;
    this.#headersService
      .createHeader(this.responseId, header)
      .subscribe(({ message }) => {
        this.#clearCreationForm();
        openToast(message, 'success');
      });
  }

  cancelEditing() {
    this.editingHeaderForm.reset();
  }

  trackByHeader(index: number, header: HeadersInterface) {
    return `${index}-${header.id}`;
  }

  #patchLocalHeader(headerId: number, { key, value }: CreateHeaderInterface) {
    const foundHeader = this.headers?.find(({ id }) => id === headerId);
    if (!foundHeader) return;
    foundHeader.key = key;
    foundHeader.value = value;
  }

  #listenOnChanges() {
    this.realtimeSubscription = this.#realtimeService
      .listenResponse(5358)
      .pipe(filter((event) => event === 'headers'))
      .subscribe(() => {
        this.getHeaders(
          1,
          calculateAmountToFetch(this.headers?.length ?? 0, 20)
        );
      });
  }

  #clearCreationForm() {
    this.createHeaderForm.reset();
  }
}
