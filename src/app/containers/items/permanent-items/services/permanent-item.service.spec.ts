import { TestBed } from '@angular/core/testing';

import { PermanentItemService } from './permanent-item.service';

describe('PermanentItemService', () => {
  let service: PermanentItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermanentItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
