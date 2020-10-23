import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesSettingsComponent } from './expenses-settings.component';

describe('ExpensesSettingsComponent', () => {
  let component: ExpensesSettingsComponent;
  let fixture: ComponentFixture<ExpensesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensesSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
