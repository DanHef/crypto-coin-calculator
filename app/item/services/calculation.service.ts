import { Injectable } from "@angular/core";

import { CalculationResult } from "../CalculationResult";
import { SecureStorage } from "nativescript-secure-storage";

import { PortfolioItemService } from "./portfolio-item.service";
import { CurrencyPriceService } from "./currency-price.service";


@Injectable()
export class CalculationService {
    private calculationResults: Array<CalculationResult> = [];
    private secureStorage: SecureStorage = new SecureStorage();
    
    constructor(private readonly portfolioItemService: PortfolioItemService,
                private readonly currencyPriceService: CurrencyPriceService) { }

    addCalculationResult(calculationResult) {
        this.calculationResults.push(calculationResult);
    }


    createCalculationResult(sourcePortfolioItemName: string, targetCurrencySymbol: string, 
                            description: string, platform: string): CalculationResult {
        let portfolioItem = this.portfolioItemService.getPortfolioItemByTechnicalName(sourcePortfolioItemName, platform);
        let currencyPrice = this.currencyPriceService.getCurrencyPrice(portfolioItem.getSymbol(), targetCurrencySymbol, platform);
        
        let newCalculationResult = new CalculationResult(description, portfolioItem, currencyPrice, platform, targetCurrencySymbol);

        this.calculationResults.push(newCalculationResult);

        return newCalculationResult;
    }


    calculateAllResults() {
        for(var i=0; i<this.calculationResults.length; i++) {
            this.calculateResult(this.calculationResults[i]);
        }
    }

    calculateResult(calculationResult: CalculationResult) {
        calculationResult.getResult();
    }

    getAllCalculationResults(): Array<CalculationResult> {
        return this.calculationResults;
    }

    //TODO: save and load have to be renewed

    saveCalculationResults() {
        this.secureStorage.setSync({
            key: "cryptoCoinCalcCalculationResultData",
            value: JSON.stringify(this.calculationResults)
        });
    }

    loadCurrencyPrices() {
        let storedCalculationResultString = this.secureStorage.getSync({
            key: "cryptoCoinCalcCalculationResultData",
        });

        if (storedCalculationResultString) {
            let storedCalculationResults = JSON.parse(storedCalculationResultString);

            for (var i = 0; i < storedCalculationResults.length; i++) {
                let storedCalculationResult = storedCalculationResults[i];

                this.createCalculationResult(storedCalculationResult.sourcePortfolioItem.portfolioItemName,
                    storedCalculationResult.targetCurrency,
                    storedCalculationResult.description,
                    storedCalculationResult.platform);

            }
        }
    }
}