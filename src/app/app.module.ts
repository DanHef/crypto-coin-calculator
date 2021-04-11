import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "@nativescript/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";

import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

import { CryptoPortfolioModule } from "./crypto-portfolio/crypto-portfolio.module";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptUIListViewModule,
        CryptoPortfolioModule
    ],
    declarations: [
        AppComponent,
        HomeComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
