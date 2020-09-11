import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermanentItemsComponent } from './permanent-items.component';

describe('PermanentItemsComponent', () => {
  let component: PermanentItemsComponent;
  let fixture: ComponentFixture<PermanentItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermanentItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermanentItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
