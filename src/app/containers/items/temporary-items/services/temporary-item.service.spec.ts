import { TestBed } from '@angular/core/testing';

import { TemporaryItemService } from './temporary-item.service';

describe('TemporaryItemService', () => {
  let service: TemporaryItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemporaryItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
