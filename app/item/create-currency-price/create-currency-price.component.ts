import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef } from "@angular/core";
import { CoinPortfolioItem } from "../CoinPortfolioItem";

import { CurrencyPriceService } from "../services/currency-price.service";
import { CurrencyPrice } from "../CurrencyPrice";

import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "create-currency-price",
    moduleId: module.id,
    templateUrl: "./create-currency-price.component.html",
})
export class CreateCurrencyPriceComponent  {
    platform: string;
    codeFrom: string;
    codeTo: string;
    description: string;

    constructor(private readonly currencyPriceService: CurrencyPriceService,
                private readonly router: Router,
                private readonly routerExtension: RouterExtensions) { }

    createCurrencyPrice() {
        this.currencyPriceService.createCurrencyPrice(this.codeFrom, this.codeTo, this.description, this.platform);

        this.routerExtension.navigate(["/items"], { clearHistory: true });
    }
}