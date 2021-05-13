import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCryptoPlatformPriceComponent } from './create-crypto-platform-price.component';

describe('CreateCryptoPlatformPriceComponent', () => {
  let component: CreateCryptoPlatformPriceComponent;
  let fixture: ComponentFixture<CreateCryptoPlatformPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCryptoPlatformPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCryptoPlatformPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
