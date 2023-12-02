import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ChartsRoutingModule } from "./charts-routing.module";

import { ChartComponent } from "./chart-component/tv-chart.component";
import { ChartDataFeed } from "./chart-component/datafeed/datafeed";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { BsDropdownConfig, BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { SimplebarAngularModule } from "simplebar-angular";
import { ModalModule } from "ngx-bootstrap/modal";

import { TabsModule } from "ngx-bootstrap/tabs";
import { NgApexchartsModule } from "ng-apexcharts";
import { ChartsPageComponent } from "./chart-page/charts.component";
import { UIModule } from "src/app/shared/ui/ui.module";
import { SharedModule } from "src/app/shared/shared.module";
import { WidgetModule } from "src/app/shared/widget/widget.module";
import { SaveLoadAdapterService } from "src/app/core/services/save-load-adapter.service";

@NgModule({
  declarations: [ChartsPageComponent, ChartComponent],
  imports: [
    CommonModule,
    ChartsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    WidgetModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    ModalModule.forRoot(),
    SharedModule
  ],
  exports: [ChartComponent],
  providers: [BsDropdownConfig, ChartDataFeed, SaveLoadAdapterService],
})
export class ChartsModule {}
