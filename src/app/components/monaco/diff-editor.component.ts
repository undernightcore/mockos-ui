import {Component, EventEmitter, Inject, Input, NgZone, Output} from '@angular/core';
import { fromEvent } from 'rxjs';

import { BaseEditor } from './base-editor';
import { NGX_MONACO_EDITOR_CONFIG, NgxMonacoEditorConfig } from './config';
import { DiffEditorModel } from './types';

declare var monaco: any;

@Component({
  selector: 'ngx-monaco-diff-editor',
  template: '<div class="editor-container" #editorContainer></div>',
  styles: [`
    :host {
      display: block;
      height: 200px;
    }

    .editor-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class DiffEditorComponent extends BaseEditor {

  _originalModel!: DiffEditorModel;
  _modifiedModel!: DiffEditorModel;

  @Output() modifiedChanged = new EventEmitter<string>();

  @Input('options')
  set options(options: any) {
    this._options = Object.assign({}, this.config.defaultOptions, options);
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(options, this.insideNg);
    }
  }

  get options(): any {
    return this._options;
  }

  @Input('originalModel')
  set originalModel(model: DiffEditorModel) {
    this._originalModel = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options, this.insideNg);
    }
  }

  @Input('modifiedModel')
  set modifiedModel(model: DiffEditorModel) {
    this._modifiedModel = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options, this.insideNg);
    }
  }

  constructor(private zone: NgZone, @Inject(NGX_MONACO_EDITOR_CONFIG) private editorConfig: NgxMonacoEditorConfig) {
    super(editorConfig);
  }

  protected initMonaco(options: any, insideNg: boolean): void {

    if (!this._originalModel || !this._modifiedModel) {
      throw new Error('originalModel or modifiedModel not found for ngx-monaco-diff-editor');
    }

    this._originalModel.language = this._originalModel.language || options.language;
    this._modifiedModel.language = this._modifiedModel.language || options.language;

    let originalModel = monaco.editor.createModel(this._originalModel.code, this._originalModel.language);
    let modifiedModel = monaco.editor.createModel(this._modifiedModel.code, this._modifiedModel.language);

    this._editorContainer.nativeElement.innerHTML = '';
    const theme = options.theme;

    if (insideNg) {
      this._editor = monaco.editor.createDiffEditor(this._editorContainer.nativeElement, options);
    } else {
      this.zone.runOutsideAngular(() => {
        this._editor = monaco.editor.createDiffEditor(this._editorContainer.nativeElement, options);
      })
    }

    options.theme = theme;
    this._editor.setModel({
      original: originalModel,
      modified: modifiedModel
    });

    const ed = this._editor.getModel().modified;

    ed.onDidChangeContent(() => {
      this.modifiedChanged.emit(ed.getValue() || '');
    });

    this.onInit.emit(this._editor);
  }
}
