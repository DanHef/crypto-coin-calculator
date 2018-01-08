import { Injectable } from "@angular/core";

import { CalculationResult } from "../CalculationResult";
import { SecureStorage } from "nativescript-secure-storage";

import { PortfolioItemService } from "./portfolio-item.service";
import { CurrencyPriceService } from "./currency-price.service";
import { ItemService } from "../item.service";


@Injectable()
export class CalculationService {
    private calculationResults: Array<CalculationResult> = [];
    private secureStorage: SecureStorage = new SecureStorage();

    constructor(private readonly portfolioItemService: PortfolioItemService,
        private readonly currencyPriceService: CurrencyPriceService,
        private readonly itemService: ItemService) { }

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


    deleteCalculationResult(calculationResult: CalculationResult) {
        for (var i = 0; i < this.calculationResults.length; i++) {
            let calcResult = this.calculationResults[i];
            if (calcResult.getPlatform() === calculationResult.getPlatform() &&
                calcResult.getDescription() === calculationResult.getDescription() &&
                calcResult.getTargetCurrency() === calculationResult.getTargetCurrency() &&
                calcResult.getSourcePortfolioItem() === calculationResult.getSourcePortfolioItem()) {
                this.calculationResults.splice(i, 1);
            }
        }
    }


    calculateAllResults(): Promise<CalculationResult[]> {
        let promises = [];
        for (var i = 0; i < this.calculationResults.length; i++) {
            promises.push(this.calculateResult(this.calculationResults[i]));
        }

        return new Promise<CalculationResult[]>((resolve, reject) => {
            Promise.all(promises).then(function() {
                resolve(this.calculationResults);
            }.bind(this));
        })
        
    }

    calculateResult(calculationResult: CalculationResult): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.determineDirectPrice(calculationResult).then((price) => {
                resolve(calculationResult.getResult(price));
            });
        });
    }

    private determineDirectPrice(calculationResult: CalculationResult): Promise<number> {
        let sourceSymbol = calculationResult.getSourcePortfolioItem().getSymbol();
        let targetSymbol = calculationResult.getTargetCurrency();
        let platform = calculationResult.getPlatform();

        //try to find a direct currency price
        let basicCurrencyPrice = this.currencyPriceService.getCurrencyPriceForDisplay(sourceSymbol, targetSymbol, platform);
        if (!basicCurrencyPrice) {
            //no direct currency price available => find fastest route to target currency
            return this.determineFastestCurrencyPrice(sourceSymbol, targetSymbol, platform);
        } else {
            //direct currency price available => return to caller
            return new Promise<number>((resolve, reject) => {
                resolve(basicCurrencyPrice.price);
            });
        }
    }

    private determineFastestCurrencyPrice(sourceSymbol: string, targetSymbol: string, platform: string): Promise<number> {
        return new Promise<number>(function(resolve, reject) {
            //currently always go through BTC
            let currencyPriceBTC = this.currencyPriceService.getCurrencyPrice(sourceSymbol, "btc", platform);
            var promisePriceBTC;
            var promisePriceBTCTarget;

            //load data from platform for this path
            if (platform === "bitfinex") {
                promisePriceBTC = this.itemService.loadDataFromBitfinexWithSymbol(currencyPriceBTC);
            } else if (platform === "bitstamp") {
                promisePriceBTC = this.itemService.loadDataFromBitstampWithSymbol(currencyPriceBTC);
            }

            let currencyPriceBTCTarget = this.currencyPriceService.getCurrencyPrice("btc", targetSymbol, platform);

            if (platform === "bitfinex") {
                promisePriceBTCTarget = this.itemService.loadDataFromBitfinexWithSymbol(currencyPriceBTCTarget);
            } else if (platform === "bitstamp") {
                promisePriceBTCTarget = this.itemService.loadDataFromBitstampWithSymbol(currencyPriceBTCTarget);
            }

            Promise.all([promisePriceBTC, promisePriceBTCTarget]).then(() => {
                if (!currencyPriceBTC.price || !currencyPriceBTCTarget) {
                    return 0;
                }

                let priceSourceBTC;
                let priceBTCTarget;

                if (currencyPriceBTC.currencyCodeTo === sourceSymbol) {
                    priceSourceBTC = 1 / currencyPriceBTC.price;
                } else {
                    priceSourceBTC = currencyPriceBTC.price;
                }

                if (currencyPriceBTCTarget.currencyCodeFrom === targetSymbol) {
                    priceBTCTarget = 1 / currencyPriceBTCTarget.price;
                } else {
                    priceBTCTarget = currencyPriceBTCTarget.price;
                }

                resolve(priceSourceBTC * priceBTCTarget);
            });
        }.bind(this));
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