import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpMethods } from 'src/app/interfaces/route.interface';

@Component({
  selector: 'app-method-selector',
  templateUrl: './method-selector.component.html',
  styleUrls: ['./method-selector.component.scss'],
})
export class MethodSelectorComponent {
  @ViewChild(CdkMenuTrigger) trigger?: CdkMenuTrigger;

  @Input() control = new FormControl<HttpMethods>('get');

  methods: HttpMethods[] = ['get', 'delete', 'patch', 'post', 'put']
}
