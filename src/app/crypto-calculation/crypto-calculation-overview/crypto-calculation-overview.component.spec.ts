import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoCalculationOverviewComponent } from './crypto-calculation-overview.component';

describe('CryptoCalculationOverviewComponent', () => {
  let component: CryptoCalculationOverviewComponent;
  let fixture: ComponentFixture<CryptoCalculationOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptoCalculationOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoCalculationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
