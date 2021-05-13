import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoPlatformPricesComponent } from './crypto-platform-prices/crypto-platform-prices.component';
import { CreateCryptoPlatformPriceComponent } from './create-crypto-platform-price/create-crypto-platform-price.component';
import { NativeScriptFormsModule } from '@nativescript/angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [CryptoPlatformPricesComponent, CreateCryptoPlatformPriceComponent],
  exports: [CryptoPlatformPricesComponent],
  imports: [
    CommonModule,
    NativeScriptFormsModule,
    HttpClientModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class CryptoPlatformModule { }
