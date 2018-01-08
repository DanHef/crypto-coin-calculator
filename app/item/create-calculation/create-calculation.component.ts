import { Component, OnInit } from "@angular/core";

import { CalculationService } from "../services/calculation.service";

import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

import { ValueList } from "nativescript-drop-down";

import { PortfolioItemService } from "../services/portfolio-item.service";
import { CurrencyPriceService } from "../services/currency-price.service";

@Component({
    selector: "create-calculation",
    moduleId: module.id,
    templateUrl: "./create-calculation.component.html",
})
export class CreateCalculationComponent implements OnInit {
    sourcePortfolioItemName: string;
    targetCurrencySymbol:string;
    description: string;

    platformList:ValueList<string> = new ValueList<string>([
        { value: "bitstamp", display: "Bitstamp" }, 
        { value: "bitfinex", display: "Bitfinex" }
    ]);
    hint = null;

    sourcePortfolioNames: ValueList<string>;
    selectedIndexPlatformList:number = this.platformList.getIndex("bitstamp");
    selectedIndexSourcePortfolio:number;

    platform: string = this.platformList.getValue(this.selectedIndexPlatformList);

    targetCurrencySymbolList: ValueList<string>;
    selectedIndexTargetCurrency: number;

    constructor(private readonly calculationService: CalculationService,
                private readonly router: Router,
                private readonly routerExtension: RouterExtensions,
                private readonly portfolioItemService: PortfolioItemService,
                private readonly currencyPriceService: CurrencyPriceService) { 
        
    }

    ngOnInit() {
        //initialize source portfolio names with default platform "bitstamp"
        this.fillPortfolioItemsList("bitstamp");
        this.fillSymbolsList("bitstamp");
    }


    createCalculationResult() {
        if(!this.platform ||
            !this.description ||
            !this.targetCurrencySymbol ||
            !this.sourcePortfolioItemName) {
            alert("Bitte alle Felder ausfüllen");
        } else {
            this.calculationService.createCalculationResult(this.sourcePortfolioItemName.toLowerCase(), this.targetCurrencySymbol.toLowerCase(), this.description, this.platform.toLowerCase());
            
            this.calculationService.saveCalculationResults();
            this.routerExtension.back();
        }
    }


    onPlatformChange(event) {
        this.platform = this.platformList.getValue(event.newIndex);

        this.fillPortfolioItemsList(this.platform);
        this.fillSymbolsList(this.platform);
    }

    private fillPortfolioItemsList(platform: string) {
        let portfolioItems = this.portfolioItemService.getAllPortfolioItems();
        let valueList = new ValueList<string>();

        for(var i=0; i<portfolioItems.length; i++) {
            if(portfolioItems[i].getPortfolioName() === platform) {
                let newValueItem = { value: portfolioItems[i].getPortfolioItemName(), display: portfolioItems[i].getPortfolioItemDescription() };
                valueList.push(newValueItem);
            }
        }

        this.sourcePortfolioNames = valueList;
    }

    private fillSymbolsList(platform:string) {
        let distinctSymbols = this.currencyPriceService.getDistinctCurrencySymbols(platform);
        let newValueList = new ValueList<string>();

        for(var i=0; i<distinctSymbols.length; i++) {
            let newValueItem = {value: distinctSymbols[i], display: distinctSymbols[i]};
            newValueList.push(newValueItem);
        }

        this.targetCurrencySymbolList = newValueList;
    }

    onSourcePortfolioChange(event) {
        this.sourcePortfolioItemName = this.sourcePortfolioNames.getValue(event.newIndex);
    }

    onTargetCurrencyChange(event) {
        this.targetCurrencySymbol = this.targetCurrencySymbolList.getValue(event.newIndex);
    }
}