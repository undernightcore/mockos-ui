import { TemplateRef } from '@angular/core';

export interface HeaderInterface {
  breadcrumb?: BreadcrumbInterface[];
  actions?: TemplateRef<HTMLDivElement>;
  hideHeader?: boolean;
}

export interface BreadcrumbInterface {
  label: string;
  link?: string;
}
