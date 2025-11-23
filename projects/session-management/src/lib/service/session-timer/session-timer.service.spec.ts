/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SessionTimerService } from './session-timer.service';

describe('Service: SessionTimer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionTimerService]
    });
  });

  it('should ...', inject([SessionTimerService], (service: SessionTimerService) => {
    expect(service).toBeTruthy();
  }));
});
