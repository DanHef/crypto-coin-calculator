import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef } from "@angular/core";
import { CoinPortfolioItem } from "../CoinPortfolioItem";

import { CurrencyPriceService } from "../services/currency-price.service";
import { CurrencyPrice } from "../CurrencyPrice";

import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

import { ValueList } from "nativescript-drop-down";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "create-currency-price",
    moduleId: module.id,
    templateUrl: "./create-currency-price.component.html",
})
export class CreateCurrencyPriceComponent implements OnInit {
    codeFrom: string;
    codeTo: string;
    description: string;

    platformList: ValueList<string> = new ValueList<string>([
        { value: "bitstamp", display: "Bitstamp" },
        { value: "bitfinex", display: "Bitfinex" }
    ]);
    selectedIndexPlatformList: number = this.platformList.getIndex("bitstamp");

    platform: string = this.platformList.getValue(this.selectedIndexPlatformList);

    currencySymbolList: ValueList<string>;
    selectedIndexCodeFrom: number;
    selectedIndexCodeTo: number;


    constructor(private readonly currencyPriceService: CurrencyPriceService,
                private readonly router: Router,
                private readonly routerExtension: RouterExtensions,
                private readonly translateService: TranslateService) { }

    ngOnInit() {
        this.fillSymbolsList("bitstamp");
    }

    createCurrencyPrice() {
        if (!this.description ||
            !this.codeFrom ||
            !this.codeTo ||
            !this.platform) {
                this.translateService.get("errorFillInAllFields").subscribe((translatedText) => {
                    alert(translatedText);
                });
        } else {
            this.currencyPriceService.createCurrencyPrice(this.codeFrom, this.codeTo, this.description, this.platform);

            this.currencyPriceService.saveCurrencyPrices();
            this.routerExtension.back();
        }
    }

    onPlatformChange(event) {
        this.platform = this.platformList.getValue(event.newIndex);
        this.fillSymbolsList(this.platform);
    }

    onCurrencyCodeFromChange(event) {
        this.codeFrom = this.currencySymbolList.getValue(event.newIndex);
    }

    onCurrencyCodeToChange(event) {
        this.codeTo = this.currencySymbolList.getValue(event.newIndex);
    }

    private fillSymbolsList(platform: string) {
        let distinctSymbols = this.currencyPriceService.getDistinctCurrencySymbols(platform);
        let newValueList = new ValueList<string>();

        for (var i = 0; i < distinctSymbols.length; i++) {
            let newValueItem = { value: distinctSymbols[i], display: distinctSymbols[i] };
            newValueList.push(newValueItem);
        }

        this.currencySymbolList = newValueList;
    }
}