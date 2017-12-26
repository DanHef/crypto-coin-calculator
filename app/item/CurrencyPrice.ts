export class CurrencyPrice {
    platform: string;
    currencyCodeFrom: string;
    currencyCodeTo: string;
    price: number;

    constructor(codeFrom, codeTo, platform) {
        this.currencyCodeFrom = codeFrom;
        this.currencyCodeTo = codeTo;
        this.platform = platform;
     };

     getSymbol(): string {
         return this.currencyCodeFrom + this.currencyCodeTo;
     }

     setPrice(newPrice: number) {
         this.price = newPrice;
     }
}
