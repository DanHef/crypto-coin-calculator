import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoPortfolioItemComponent } from './crypto-portfolio-item.component';

describe('CryptoPortfolioItemComponent', () => {
  let component: CryptoPortfolioItemComponent;
  let fixture: ComponentFixture<CryptoPortfolioItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptoPortfolioItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoPortfolioItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
