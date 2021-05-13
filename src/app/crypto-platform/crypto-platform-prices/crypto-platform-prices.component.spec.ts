import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoPlatformPricesComponent } from './crypto-platform-prices.component';

describe('CryptoPlatformPricesComponent', () => {
  let component: CryptoPlatformPricesComponent;
  let fixture: ComponentFixture<CryptoPlatformPricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptoPlatformPricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoPlatformPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
