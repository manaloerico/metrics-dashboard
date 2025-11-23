/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SessionManagementService } from './session-management.service';

describe('Service: SessionManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionManagementService]
    });
  });

  it('should ...', inject([SessionManagementService], (service: SessionManagementService) => {
    expect(service).toBeTruthy();
  }));
});
