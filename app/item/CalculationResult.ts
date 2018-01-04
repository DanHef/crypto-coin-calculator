import { CoinPortfolioItem } from "./CoinPortfolioItem";
import { CurrencyPrice } from "./CurrencyPrice";

export class CalculationResult {
    private platform: string;
    private description: string;
    private result: number;
    private sourcePortfolioItem: CoinPortfolioItem;
    private targetCurrencyPrice: CurrencyPrice;

    constructor(description: string, sourcePortfolioItem: CoinPortfolioItem, targetCurrency: CurrencyPrice, platform:string) {
        this.sourcePortfolioItem = sourcePortfolioItem;
        this.targetCurrencyPrice = targetCurrency;
        this.platform = platform.toLowerCase();
        this.description = description;
     };


     getResult(): number {
        this.calculateResult();
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
