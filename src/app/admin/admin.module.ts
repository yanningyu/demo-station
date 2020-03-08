import { CalulateSchedulePipe } from './pipes/calulate-schedule.pipe';
import { StationListService } from './services/station-list.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { StationListComponent } from './station-list/station-list.component';


@NgModule({
  declarations: [StationListComponent, CalulateSchedulePipe],
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  providers:[
    StationListService
  ]
})
export class AdminModule { }
