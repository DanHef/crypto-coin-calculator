import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { ItemService } from "./item/item.service";
import { PortfolioItemService } from "./item/services/portfolio-item.service";
import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";
import { CreatePortfolioItemComponent } from "./item/create-portfolio-item/create-portfolio-item.component";
import { CreateCurrencyPriceComponent } from "./item/create-currency-price/create-currency-price.component";
import { CreateCalculationComponent } from "./item/create-calculation/create-calculation.component";
import { CurrencyPriceService } from "./item/services/currency-price.service";
import { CalculationService } from "./item/services/calculation.service";
import { PlatformService } from "./item/services/platform.service";

import { DropDownModule } from "nativescript-drop-down/angular";

import * as elementRegistryModule from 'nativescript-angular/element-registry';
import * as Admob from "nativescript-admob";

import * as platformModule from "tns-core-modules/platform";

// Uncomment and add to NgModule imports if you need to use two-way binding
import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
import { NativeScriptHttpModule } from "nativescript-angular/http";

import { Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService } from "ng2-translate";

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, '/./i18n', '.json');
}

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpModule,
        DropDownModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        })
    ],
    declarations: [
        AppComponent,
        ItemsComponent,
        ItemDetailComponent,
        CreatePortfolioItemComponent,
        CreateCurrencyPriceComponent,
        CreateCalculationComponent
    ],
    providers: [
        ItemService,
        PortfolioItemService,
        CurrencyPriceService,
        CalculationService,
        PlatformService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    entryComponents: []
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
