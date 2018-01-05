export class CurrencyPrice {
    platform: string;
    currencyPriceDescription: string;
    currencyCodeFrom: string;
    currencyCodeTo: string;
    price: number;

    constructor(codeFrom, codeTo, platform) {
        this.currencyCodeFrom = codeFrom.toLowerCase();
        this.currencyCodeTo = codeTo.toLowerCase();
        this.platform = platform.toLowerCase();
     };

     setDescription(description: string) {
         this.currencyPriceDescription = description;
     }

     getDescription() {
         return this.currencyPriceDescription;
     }

     getSymbol(): string {
         return this.currencyCodeFrom + this.currencyCodeTo;
     }

     setPrice(newPrice: number) {
         this.price = newPrice;
     }

     isRelevantForDisplay(): boolean {
         //description is mandatory for those currency prices which are displayed
         return !!this.currencyPriceDescription;
     }
}
