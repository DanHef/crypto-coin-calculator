import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ItemsComponent } from "./item/items.component";
import { CreatePortfolioItemComponent } from "./item/create-portfolio-item/create-portfolio-item.component";
import { CreateCurrencyPriceComponent } from "./item/create-currency-price/create-currency-price.component";
import { CreateCalculationComponent } from "./item/create-calculation/create-calculation.component";

const routes: Routes = [
    { path: "", redirectTo: "/items", pathMatch: "full" },
    { path: "items", component: ItemsComponent },
    { path: "createPortfolioItem", component: CreatePortfolioItemComponent},
    { path: "createCurrencyPrice", component: CreateCurrencyPriceComponent},
    { path: "createCalculationResult", component: CreateCalculationComponent}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }