export class CurrencyPrice {
    platform: string;
    currencyPriceDescription: string;
    currencyCodeFrom: string;
    currencyCodeTo: string;
    price: number;

    constructor(codeFrom, codeTo, platform, description) {
        this.currencyCodeFrom = codeFrom;
        this.currencyCodeTo = codeTo;
        this.platform = platform;
        this.currencyPriceDescription = description;
     };

     getSymbol(): string {
         return this.currencyCodeFrom + this.currencyCodeTo;
     }

     setPrice(newPrice: number) {
         this.price = newPrice;
     }
}
