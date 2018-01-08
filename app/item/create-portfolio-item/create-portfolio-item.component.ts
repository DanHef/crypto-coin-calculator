import { Component, OnInit } from "@angular/core";
import { CoinPortfolioItem } from "../CoinPortfolioItem";

import { PortfolioItemService } from "../services/portfolio-item.service";

import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

import { ValueList } from "nativescript-drop-down";

import { CurrencyPriceService } from "../services/currency-price.service";

@Component({
    selector: "create-portfolio-item",
    moduleId: module.id,
    templateUrl: "./create-portfolio-item.component.html",
})
export class CreatePortfolioItemComponent implements OnInit {
    technicalName: string;
    quantity: number;
    description: string;
    symbol: string;

    platformList: ValueList<string> = new ValueList<string>([
        { value: "bitstamp", display: "Bitstamp" },
        { value: "bitfinex", display: "Bitfinex" }
    ]);
    selectedIndexPlatformList: number = this.platformList.getIndex("bitstamp");

    portfolio: string = this.platformList.getValue(this.selectedIndexPlatformList);

    selectedIndexCurrencySymbol: number;
    currencySymbolList: ValueList<string>;

    constructor(private readonly portfolioItemService: PortfolioItemService,
        private readonly router: Router,
        private readonly routerExtension: RouterExtensions,
        private readonly currencyPriceService: CurrencyPriceService) { }

    ngOnInit() {
        this.fillSymbolsList("bitstamp");
    }

    onCreatePortfolioItem() {
        if (!this.description ||
            !this.portfolio ||
            !this.symbol ||
            !this.quantity ||
            !this.technicalName) {
            alert("Bitte alle Felder ausfüllen");
        } else {
            this.portfolioItemService.createPortfolioItem(this.technicalName, this.description,
                this.quantity, this.portfolio, this.symbol);
            this.portfolioItemService.savePortfolio();

            this.routerExtension.back();
        }
    }

    onPlatformChange(event) {
        this.portfolio = this.platformList.getValue(event.newIndex);
        this.fillSymbolsList(this.portfolio);
    }

    onCurrencySymbolChange(event) {
        this.symbol = this.currencySymbolList.getValue(event.newIndex);
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