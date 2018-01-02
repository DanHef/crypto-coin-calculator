import { Injectable } from "@angular/core";

import { CurrencyPrice } from "../CurrencyPrice";
import { SecureStorage } from "nativescript-secure-storage";

@Injectable()
export class CurrencyPriceService {
    currencyPrices: Array<CurrencyPrice> = [];
    secureStorage: SecureStorage = new SecureStorage();


    addCurrencyPrice(currencyPrice) {
        this.currencyPrices.push(currencyPrice);
    }


    createCurrencyPrice(codeFrom: string, codeTo: string, description, platform): CurrencyPrice {
        let newCurrencyPrice = new CurrencyPrice(codeFrom, codeTo, platform, description);

        this.currencyPrices.push(newCurrencyPrice);

        return newCurrencyPrice;
    }


    getAllCurrencyPrices(platform?: string): Array<CurrencyPrice> {
        let currencyPrices;

        if (platform) {
            currencyPrices = [];
            for (var i = 0; i < this.currencyPrices.length; i++) {
                if (this.currencyPrices[i].platform === platform) {
                    currencyPrices.push(this.currencyPrices[i]);
                }
            }
        } else {
            currencyPrices = this.currencyPrices;
        }

        return currencyPrices;
    }


    getCurrencyPriceAmount(codeFrom: string, codeTo: string, platform: string): number {
        for (var i = 0; i < this.currencyPrices.length; i++) {
            if (this.currencyPrices[i].currencyCodeFrom === codeFrom &&
                this.currencyPrices[i].currencyCodeTo === codeTo &&
                this.currencyPrices[i].platform === platform) {
                return this.currencyPrices[i].price;
            }
        }
    }


    saveCurrencyPrices() {
        this.secureStorage.setSync({
            key: "cryptoCoinCalcPriceInformationData",
            value: JSON.stringify(this.currencyPrices)
        });
    }

    loadCurrencyPrices() {
        let storedPriceInformationString = this.secureStorage.getSync({
            key: "cryptoCoinCalcPriceInformationData",
        });

        if (storedPriceInformationString) {
            let storedPriceInformations = JSON.parse(storedPriceInformationString);

            for (var i = 0; i < storedPriceInformations.length; i++) {
                let storedPriceInformation = storedPriceInformations[i];

                this.createCurrencyPrice(storedPriceInformation.currencyCodeFrom,
                    storedPriceInformation.currencyCodeTo,
                    storedPriceInformation.description,
                    storedPriceInformation.platform);

            }
        }
    }
}