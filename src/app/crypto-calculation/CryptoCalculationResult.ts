import { CryptoPlatform } from '../crypto-platform/crypto-platform.enum';
import { ICryptoPortfolioItem } from '../crypto-portfolio/crypto-portfolio-item/crypto-portfolio-item';
import {CurrencyTradingPairPrice} from '../crypto-platform/crypto-platform.service';

export class CryptoCalculationResult {
    public platform: CryptoPlatform;
    private description: string;
    private sourcePortfolioItem: ICryptoPortfolioItem;
    private tradingPairPrice: CurrencyTradingPairPrice;
    private targetCurrency: string;
    private result;

    constructor(description: string, sourcePortfolioItem: ICryptoPortfolioItem, tradingPairPrice: CurrencyTradingPairPrice, platform: CryptoPlatform,
        targetCurrencySymbol: string) {
        this.sourcePortfolioItem = sourcePortfolioItem;
        this.targetCurrency = targetCurrencySymbol;
        this.platform = platform;
        this.description = description;
        this.tradingPairPrice = tradingPairPrice;
    };

    public getResult() {
        this.calculateResult();
        return this.result;
    }

    public calculateResult() {
        this.result = this.tradingPairPrice.price * this.sourcePortfolioItem.quantity;
    }
}