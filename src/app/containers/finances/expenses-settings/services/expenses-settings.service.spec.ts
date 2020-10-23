import { TestBed } from '@angular/core/testing';

import { ExpensesSettingsService } from './expenses-settings.service';

describe('ExpensesSettingsService', () => {
  let service: ExpensesSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpensesSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
