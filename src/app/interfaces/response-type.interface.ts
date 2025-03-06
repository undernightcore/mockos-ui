export interface ResponseTypeInterface {
  contentType: string;
  editorType: EditorTypeEnum;
}

export enum EditorTypeEnum {
  JSON = 'json',
  HTML = 'html',
  TEXT = 'text',
  YAML = 'yaml',
}
