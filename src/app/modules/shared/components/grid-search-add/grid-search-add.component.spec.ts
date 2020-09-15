import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSearchAddComponent } from './grid-search-add.component';

describe('GridSearchAddComponent', () => {
  let component: GridSearchAddComponent;
  let fixture: ComponentFixture<GridSearchAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSearchAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSearchAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
