import { TestBed } from '@angular/core/testing';

import { DateUtilsTsService } from './date.utils';

describe('DateUtilsTsService', () => {
  let service: DateUtilsTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateUtilsTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
