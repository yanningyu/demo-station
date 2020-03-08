import { IStation } from './../interfaces/i-station';
import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

@Pipe({
  name: 'calulateSchedule'
})
export class CalulateSchedulePipe implements PipeTransform {

  /**
   *
   */
  constructor(private cdr: ChangeDetectorRef) {
    this.cdr.markForCheck();

  }
  transform(value: IStation[], args?: any): any {

    if(value === undefined){
      return 0 + 'm';
    }
     let total = 0;
     value.forEach((station: IStation) => total += station.Time);
     return `${total}m`;
  }

}
