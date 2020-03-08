/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StationListService } from './station-list.service';

describe('Service: StationList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StationListService]
    });
  });

  it('should ...', inject([StationListService], (service: StationListService) => {
    expect(service).toBeTruthy();
  }));
});
