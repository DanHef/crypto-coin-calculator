import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoPortfolioComponent } from './crypto-portfolio.component';

describe('CryptoPortfolioComponent', () => {
  let component: CryptoPortfolioComponent;
  let fixture: ComponentFixture<CryptoPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptoPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
