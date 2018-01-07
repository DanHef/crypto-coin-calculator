import { CoinPortfolioItem } from "./CoinPortfolioItem";
import { CurrencyPrice } from "./CurrencyPrice";

export class CalculationResult {
    private platform: string;
    private description: string;
    private result: number;
    private sourcePortfolioItem: CoinPortfolioItem;
    private targetCurrencyPrice: CurrencyPrice;
    private targetCurrency: string;

    constructor(description: string, sourcePortfolioItem: CoinPortfolioItem, targetCurrency: CurrencyPrice, platform:string,
                targetCurrencySymbol: string) {
        this.sourcePortfolioItem = sourcePortfolioItem;
        this.targetCurrencyPrice = targetCurrency;
        this.targetCurrency = targetCurrencySymbol;
        this.platform = platform.toLowerCase();
        this.description = description;
     };

     getPlatform() {
         return this.platform;
     }

     getDescription() {
         return this.description;
     }

     getSourcePortfolioItem() {
         return this.sourcePortfolioItem;
     }

     getTargetCurrencyPrice() {
         return this.targetCurrencyPrice;
     }

     getTargetCurrency() {
         return this.targetCurrency;
     }


     getResult(price: number): number {
        this.result = this.sourcePortfolioItem.getQuantity() * price;
        return this.result;
     }

     private calculateResult() {
         if(this.targetCurrencyPrice.currencyCodeFrom === this.sourcePortfolioItem.getSymbol()) {
            this.result = this.targetCurrencyPrice.price * this.sourcePortfolioItem.getQuantity();
         } else {
            this.result = this.sourcePortfolioItem.getQuantity() / this.targetCurrencyPrice.price;
         }
     }
}
