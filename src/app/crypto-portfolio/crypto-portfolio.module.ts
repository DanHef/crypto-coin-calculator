import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoPortfolioComponent } from './crypto-portfolio.component';
import { CryptoPortfolioItemComponent } from './crypto-portfolio-item.component';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptFormsModule } from "@nativescript/angular"

@NgModule({
  declarations: [
      CryptoPortfolioComponent,
      CryptoPortfolioItemComponent
  ],
  exports: [
    CryptoPortfolioComponent
  ],
  imports: [
    CommonModule,
    NativeScriptUIListViewModule,
    NativeScriptFormsModule
  ]
})
export class CryptoPortfolioModule { }
