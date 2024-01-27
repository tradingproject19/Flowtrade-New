import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OptionsRoutingModule } from './options-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';

import { NgApexchartsModule } from 'ng-apexcharts';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule,BsDropdownConfig} from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SimplebarAngularModule } from 'simplebar-angular';

import { OptionsComponent } from './options-page/options.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartsModule } from '../charts/charts.module';

@NgModule({
  declarations: [OptionsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OptionsRoutingModule,
    UIModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    WidgetModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    ModalModule.forRoot(),
    SharedModule,
    ChartsModule,
  ],
  providers: [BsDropdownConfig],
})
export class OptionsModule { }
