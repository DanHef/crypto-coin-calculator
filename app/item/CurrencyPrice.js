"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CurrencyPrice = (function () {
    function CurrencyPrice(codeFrom, codeTo, platform) {
        this.currencyCodeFrom = codeFrom;
        this.currencyCodeTo = codeTo;
        this.platform = platform;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3VycmVuY3lQcmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkN1cnJlbmN5UHJpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtJQU1JLHVCQUFZLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUTtRQUNsQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzVCLENBQUM7SUFBQSxDQUFDO0lBRUYsaUNBQVMsR0FBVDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsZ0NBQVEsR0FBUixVQUFTLFFBQWdCO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO0lBQzFCLENBQUM7SUFDTixvQkFBQztBQUFELENBQUMsQUFuQkQsSUFtQkM7QUFuQlksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQ3VycmVuY3lQcmljZSB7XG4gICAgcGxhdGZvcm06IHN0cmluZztcbiAgICBjdXJyZW5jeUNvZGVGcm9tOiBzdHJpbmc7XG4gICAgY3VycmVuY3lDb2RlVG86IHN0cmluZztcbiAgICBwcmljZTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoY29kZUZyb20sIGNvZGVUbywgcGxhdGZvcm0pIHtcbiAgICAgICAgdGhpcy5jdXJyZW5jeUNvZGVGcm9tID0gY29kZUZyb207XG4gICAgICAgIHRoaXMuY3VycmVuY3lDb2RlVG8gPSBjb2RlVG87XG4gICAgICAgIHRoaXMucGxhdGZvcm0gPSBwbGF0Zm9ybTtcbiAgICAgfTtcblxuICAgICBnZXRTeW1ib2woKTogc3RyaW5nIHtcbiAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbmN5Q29kZUZyb20gKyB0aGlzLmN1cnJlbmN5Q29kZVRvO1xuICAgICB9XG5cbiAgICAgc2V0UHJpY2UobmV3UHJpY2U6IG51bWJlcikge1xuICAgICAgICAgdGhpcy5wcmljZSA9IG5ld1ByaWNlO1xuICAgICB9XG59XG4iXX0=