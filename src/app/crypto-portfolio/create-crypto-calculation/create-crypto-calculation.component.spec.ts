import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCryptoCalculationComponent } from './create-crypto-calculation.component';

describe('CreateCryptoCalculationComponent', () => {
  let component: CreateCryptoCalculationComponent;
  let fixture: ComponentFixture<CreateCryptoCalculationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCryptoCalculationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCryptoCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
