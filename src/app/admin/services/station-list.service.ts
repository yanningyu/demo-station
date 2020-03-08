import { IStation } from './../interfaces/i-station';
import { ITrainRoute } from './../interfaces/itrain-route';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, map, tap, distinct, toArray } from 'rxjs/operators';
import * as _ from 'underscore';
import { ReplaySubject, combineLatest } from 'rxjs';

@Injectable()
export class StationListService {
  private url = 'assets/RailwayStations.json';
  private startFromSubject = new ReplaySubject<string>();
  private startFromAction$ = this.startFromSubject.asObservable();

  private arriveAtSubject = new ReplaySubject<string>();
  private arriveAtAction$ = this.arriveAtSubject.asObservable();

  private trainRoutes: ITrainRoute[] = [];
  private selectedTrainRoute: ITrainRoute = {} as ITrainRoute;
  stations$ =
    this.http.get<IStation[]>(this.url)
      .pipe(shareReplay());
  startFroms$ =
    this.stations$
      .pipe(
        map(stations => _.uniq(stations.map(x => x.DepartFrom)))
      );

  arriveAts$ = combineLatest([
    this.stations$,
    this.startFromAction$]).pipe(
      map(([stations, startFrom]) =>
        _.filter(_.uniq(stations.map(x => x.ArriveAt)), (arriveAt) => arriveAt !== startFrom)
      ));

  stationSchedule$ = combineLatest([
    this.stations$,
    this.startFromAction$,
    this.arriveAtAction$,
  ]).pipe(
    map(([stations, startFromAction, arriveAtAction]) => {
      this.getDestinationRoutes(stations, [startFromAction], arriveAtAction);
      return this.selectedTrainRoute.stations;
    })
  );
  constructor(private http: HttpClient) {
    console.log('url', this.url);
  }

  selectedStartFromChanged = (startFrom: string) => {
    this.trainRoutes = [];
    this.selectedTrainRoute = {}  as ITrainRoute;
    this.startFromSubject.next(startFrom);
  }

  selectedArriveAtChanged = (arriveAt: string) => {
    this.trainRoutes = [];
    this.selectedTrainRoute = {}  as ITrainRoute;
    this.arriveAtSubject.next(arriveAt);
  }

  private getDestinationRoutes(stations: IStation[], startFroms: string[], arriveAt: string) {

    const tempFilterStations: IStation[] = _.filter(stations, (station: IStation) => {
      return _.contains(startFroms, station.DepartFrom);
    });

    const tempFilterStationWithDes: IStation[] = _.filter(tempFilterStations, (station: IStation) => station.ArriveAt === arriveAt);

    if (tempFilterStationWithDes.length === 1) {
      const tempTrainRoute: ITrainRoute = { stations: [] } as ITrainRoute;

      if (this.trainRoutes.length === 0) {

        tempTrainRoute.stations.push(tempFilterStationWithDes[0]);
        this.selectedTrainRoute = tempTrainRoute;
      } else {
        let keepGoing = true;
        this.trainRoutes.forEach((trainRoute: ITrainRoute) => {
          if (keepGoing) {

            const tempRoute = trainRoute.stations.find((station: IStation) => {
              console.log('station', station);
              return station.ArriveAt === tempFilterStationWithDes[0].DepartFrom;
            });

            if (tempRoute !== undefined) {
              trainRoute.stations.push(tempFilterStationWithDes[0]);
              this.selectedTrainRoute = trainRoute;
              keepGoing = false;
            }
          }
        });
      }
      return;
    }
    if (this.trainRoutes.length === 0) {
      tempFilterStations.forEach((station: IStation) => {
        const tempTrainRoute: ITrainRoute = { stations: [] } as ITrainRoute;
        tempTrainRoute.stations.push(station);
        this.trainRoutes.push(tempTrainRoute);
      });
    } else {
      const count = this.trainRoutes.length;
      for (let i = 0; i < count; i++) {
        const trainRoute = this.trainRoutes[i];
        const filterText = trainRoute.stations[trainRoute.stations.length - 1].ArriveAt;
        const filterStations = tempFilterStations.filter((station: IStation) => station.DepartFrom === filterText);

        trainRoute.stations.push(filterStations[0]);
        if (filterStations.length > 1) {
          for (let j = 1; j < filterStations.length; j++) {
            const tempStations: IStation[] = [];
            Object.assign(tempStations, trainRoute.stations);
            this.trainRoutes.push({ stations: tempStations });
          }
        }
      }
    }

    const src = _.map(tempFilterStations, (station: IStation) => station.ArriveAt)
    this.getDestinationRoutes(stations, src, arriveAt);
  }
  private getArriveAtStations = (stations: IStation[], startFroms: string[]): string[] => {
    const arriveAts: string[] = [];
    const tempFilterStations: IStation[] = _.filter(stations, (station: IStation) => {
      return _.contains(startFroms, station.DepartFrom);
    });

    if (tempFilterStations.length > 0) {
      let tempArriveAts: string[] = [];
      tempArriveAts = _.map(tempFilterStations, (station: IStation) => station.ArriveAt);
      arriveAts.push(_.map(tempFilterStations, (station: IStation) => station.ArriveAt));
      arriveAts.push(
        _.map(this.getArriveAtStations(stations, tempArriveAts), (arriveAt: string) => arriveAt));
    }

    return arriveAts;
  }
}
