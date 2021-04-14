import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoPortfolioComponent } from './crypto-portfolio.component';
import { CryptoPortfolioItemComponent } from './crypto-portfolio-item/crypto-portfolio-item.component';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptFormsModule } from "@nativescript/angular";

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
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class CryptoPortfolioModule { }
