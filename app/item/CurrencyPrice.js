"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CurrencyPrice = (function () {
    function CurrencyPrice(codeFrom, codeTo, platform, description) {
        this.currencyCodeFrom = codeFrom;
        this.currencyCodeTo = codeTo;
        this.platform = platform;
        this.currencyPriceDescription = description;
    }
    ;
    CurrencyPrice.prototype.getSymbol = function () {
        return this.currencyCodeFrom + this.currencyCodeTo;
    };
    CurrencyPrice.prototype.setPrice = function (newPrice) {
        this.price = newPrice;
    };
    return CurrencyPrice;
}());
exports.CurrencyPrice = CurrencyPrice;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3VycmVuY3lQcmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkN1cnJlbmN5UHJpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtJQU9JLHVCQUFZLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVc7UUFDL0MsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQztRQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsd0JBQXdCLEdBQUcsV0FBVyxDQUFDO0lBQy9DLENBQUM7SUFBQSxDQUFDO0lBRUYsaUNBQVMsR0FBVDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsZ0NBQVEsR0FBUixVQUFTLFFBQWdCO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO0lBQzFCLENBQUM7SUFDTixvQkFBQztBQUFELENBQUMsQUFyQkQsSUFxQkM7QUFyQlksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQ3VycmVuY3lQcmljZSB7XG4gICAgcGxhdGZvcm06IHN0cmluZztcbiAgICBjdXJyZW5jeVByaWNlRGVzY3JpcHRpb246IHN0cmluZztcbiAgICBjdXJyZW5jeUNvZGVGcm9tOiBzdHJpbmc7XG4gICAgY3VycmVuY3lDb2RlVG86IHN0cmluZztcbiAgICBwcmljZTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoY29kZUZyb20sIGNvZGVUbywgcGxhdGZvcm0sIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuY3VycmVuY3lDb2RlRnJvbSA9IGNvZGVGcm9tO1xuICAgICAgICB0aGlzLmN1cnJlbmN5Q29kZVRvID0gY29kZVRvO1xuICAgICAgICB0aGlzLnBsYXRmb3JtID0gcGxhdGZvcm07XG4gICAgICAgIHRoaXMuY3VycmVuY3lQcmljZURlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgIH07XG5cbiAgICAgZ2V0U3ltYm9sKCk6IHN0cmluZyB7XG4gICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeUNvZGVGcm9tICsgdGhpcy5jdXJyZW5jeUNvZGVUbztcbiAgICAgfVxuXG4gICAgIHNldFByaWNlKG5ld1ByaWNlOiBudW1iZXIpIHtcbiAgICAgICAgIHRoaXMucHJpY2UgPSBuZXdQcmljZTtcbiAgICAgfVxufVxuIl19