import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoCalculationOverviewComponent } from './crypto-calculation-overview/crypto-calculation-overview.component';

@NgModule({
    declarations: [
        CryptoCalculationOverviewComponent
    ],
    imports: [
        CommonModule
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class CryptoCalculationModule { }
