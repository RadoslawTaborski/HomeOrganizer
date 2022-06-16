import { TestBed } from '@angular/core/testing';

import { ListcategoriesService } from './listcategories.service';

describe('ListcategoriesService', () => {
  let service: ListcategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListcategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
