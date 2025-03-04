import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { TokensInterface } from '../../../../../../interfaces/tokens.interface';
import { TokensService } from '../../../../../../services/tokens/tokens.service';
import { openToast } from '../../../../../../utils/toast.utils';
import { CreateTokenComponent } from '../create-token/create-token.component';
import { DeleteTokenComponent } from '../delete-token/delete-token.component';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
})
export class TokensComponent implements OnInit {
  tokens?: TokensInterface[];
  maxTokens = 0;
  #isFetching = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public projectId: number,
    public dialogRef: DialogRef,
    private tokensService: TokensService,
    private translateService: TranslateService,
    private dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.#getTokens();
  }

  handlePageChange(page: number) {
    if (this.#isFetching) return;
    this.#getTokens(page);
  }

  handleDelete(tokenId: number) {
    this.dialogService.open(DeleteTokenComponent, {
      data: { tokenId, projectId: this.projectId },
      autoFocus: false,
    });
    this.dialogRef.close();
  }

  handleCreate() {
    this.dialogService.open(CreateTokenComponent, {
      data: this.projectId,
      autoFocus: false,
    });
    this.dialogRef.close();
  }

  showCopied() {
    openToast(
      this.translateService.instant('COMMON.COPIED_TO_CLIPBOARD'),
      'success'
    );
  }

  openDocumentation() {
    open('https://docs.mockos.io/docs/integrating/', '_blank');
  }

  #getTokens(page = 1) {
    this.tokensService
      .getTokens(this.projectId, page, 20)
      .pipe(
        tap({
          subscribe: () => (this.#isFetching = true),
          finalize: () => (this.#isFetching = false),
        })
      )
      .subscribe((tokens) => {
        this.maxTokens = tokens.meta.total;
        this.tokens =
          page === 1 ? tokens.data : [...(this.tokens ?? []), ...tokens.data];
      });
  }
}
