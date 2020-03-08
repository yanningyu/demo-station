import { distinct } from 'rxjs/operators';
import { StationListService } from './../services/station-list.service';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})
export class StationListComponent implements OnInit {

  startFroms$ = this.stationListService.startFroms$;
  arriveAt$ = this.stationListService.arriveAts$;
  selectedTrainRoute$ = this.stationListService.stationSchedule$;
  constructor(private stationListService: StationListService) { }

  ngOnInit() {}

  onStartFormSelected = (startFrom: string) => {
    this.stationListService.selectedStartFromChanged(startFrom);
  }

  onArriveAtSelected = (arriveAt: string) => {
    this.stationListService.selectedArriveAtChanged(arriveAt);
  }
}
