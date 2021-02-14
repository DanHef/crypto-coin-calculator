"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var currency_price_service_1 = require("../services/currency-price.service");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var nativescript_drop_down_1 = require("nativescript-drop-down");
var core_2 = require("@ngx-translate/core");
var CreateCurrencyPriceComponent = /** @class */ (function () {
    function CreateCurrencyPriceComponent(currencyPriceService, router, routerExtension, translateService) {
        this.currencyPriceService = currencyPriceService;
        this.router = router;
        this.routerExtension = routerExtension;
        this.translateService = translateService;
        this.platformList = new nativescript_drop_down_1.ValueList([
            { value: "bitstamp", display: "Bitstamp" },
            { value: "bitfinex", display: "Bitfinex" }
        ]);
        this.selectedIndexPlatformList = this.platformList.getIndex("bitstamp");
        this.platform = this.platformList.getValue(this.selectedIndexPlatformList);
    }
    CreateCurrencyPriceComponent.prototype.ngOnInit = function () {
        this.fillSymbolsList("bitstamp");
    };
    CreateCurrencyPriceComponent.prototype.createCurrencyPrice = function () {
        if (!this.description ||
            !this.codeFrom ||
            !this.codeTo ||
            !this.platform) {
            this.translateService.get("errorFillInAllFields").subscribe(function (translatedText) {
                alert(translatedText);
            });
        }
        else {
            this.currencyPriceService.createCurrencyPrice(this.codeFrom, this.codeTo, this.description, this.platform);
            this.currencyPriceService.saveCurrencyPrices();
            this.routerExtension.back();
        }
    };
    CreateCurrencyPriceComponent.prototype.onPlatformChange = function (event) {
        this.platform = this.platformList.getValue(event.newIndex);
        this.fillSymbolsList(this.platform);
    };
    CreateCurrencyPriceComponent.prototype.onCurrencyCodeFromChange = function (event) {
        this.codeFrom = this.currencySymbolList.getValue(event.newIndex);
    };
    CreateCurrencyPriceComponent.prototype.onCurrencyCodeToChange = function (event) {
        this.codeTo = this.currencySymbolList.getValue(event.newIndex);
    };
    CreateCurrencyPriceComponent.prototype.fillSymbolsList = function (platform) {
        var distinctSymbols = this.currencyPriceService.getDistinctCurrencySymbols(platform);
        var newValueList = new nativescript_drop_down_1.ValueList();
        for (var i = 0; i < distinctSymbols.length; i++) {
            var newValueItem = { value: distinctSymbols[i], display: distinctSymbols[i] };
            newValueList.push(newValueItem);
        }
        this.currencySymbolList = newValueList;
    };
    CreateCurrencyPriceComponent = __decorate([
        core_1.Component({
            selector: "create-currency-price",
            moduleId: module.id,
            templateUrl: "./create-currency-price.component.html",
        }),
        __metadata("design:paramtypes", [currency_price_service_1.CurrencyPriceService,
            router_1.Router,
            router_2.RouterExtensions,
            core_2.TranslateService])
    ], CreateCurrencyPriceComponent);
    return CreateCurrencyPriceComponent;
}());
exports.CreateCurrencyPriceComponent = CreateCurrencyPriceComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWN1cnJlbmN5LXByaWNlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZS1jdXJyZW5jeS1wcmljZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBOEY7QUFHOUYsNkVBQTBFO0FBRzFFLDBDQUF5QztBQUN6QyxzREFBK0Q7QUFFL0QsaUVBQW1EO0FBQ25ELDRDQUF1RDtBQU92RDtJQWtCSSxzQ0FBNkIsb0JBQTBDLEVBQzFDLE1BQWMsRUFDZCxlQUFpQyxFQUNqQyxnQkFBa0M7UUFIbEMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2Qsb0JBQWUsR0FBZixlQUFlLENBQWtCO1FBQ2pDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFoQi9ELGlCQUFZLEdBQXNCLElBQUksa0NBQVMsQ0FBUztZQUNwRCxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtZQUMxQyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtTQUM3QyxDQUFDLENBQUM7UUFDSCw4QkFBeUIsR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUzRSxhQUFRLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFVWCxDQUFDO0lBRXBFLCtDQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCwwREFBbUIsR0FBbkI7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDakIsQ0FBQyxJQUFJLENBQUMsUUFBUTtZQUNkLENBQUMsSUFBSSxDQUFDLE1BQU07WUFDWixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUMsY0FBYztnQkFDdkUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1NBQ1Y7YUFBTTtZQUNILElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFM0csSUFBSSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMvQjtJQUNMLENBQUM7SUFFRCx1REFBZ0IsR0FBaEIsVUFBaUIsS0FBSztRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsK0RBQXdCLEdBQXhCLFVBQXlCLEtBQUs7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQsNkRBQXNCLEdBQXRCLFVBQXVCLEtBQUs7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRU8sc0RBQWUsR0FBdkIsVUFBd0IsUUFBZ0I7UUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLDBCQUEwQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JGLElBQUksWUFBWSxHQUFHLElBQUksa0NBQVMsRUFBVSxDQUFDO1FBRTNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdDLElBQUksWUFBWSxHQUFHLEVBQUUsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDOUUsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNuQztRQUVELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxZQUFZLENBQUM7SUFDM0MsQ0FBQztJQWxFUSw0QkFBNEI7UUFMeEMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSx3Q0FBd0M7U0FDeEQsQ0FBQzt5Q0FtQnFELDZDQUFvQjtZQUNsQyxlQUFNO1lBQ0cseUJBQWdCO1lBQ2YsdUJBQWdCO09BckJ0RCw0QkFBNEIsQ0FtRXhDO0lBQUQsbUNBQUM7Q0FBQSxBQW5FRCxJQW1FQztBQW5FWSxvRUFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBBZnRlclZpZXdJbml0LCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvaW5Qb3J0Zm9saW9JdGVtIH0gZnJvbSBcIi4uL0NvaW5Qb3J0Zm9saW9JdGVtXCI7XG5cbmltcG9ydCB7IEN1cnJlbmN5UHJpY2VTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL2N1cnJlbmN5LXByaWNlLnNlcnZpY2VcIjtcbmltcG9ydCB7IEN1cnJlbmN5UHJpY2UgfSBmcm9tIFwiLi4vQ3VycmVuY3lQcmljZVwiO1xuXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuXG5pbXBvcnQgeyBWYWx1ZUxpc3QgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWRyb3AtZG93blwiO1xuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gXCJAbmd4LXRyYW5zbGF0ZS9jb3JlXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcImNyZWF0ZS1jdXJyZW5jeS1wcmljZVwiLFxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jcmVhdGUtY3VycmVuY3ktcHJpY2UuY29tcG9uZW50Lmh0bWxcIixcbn0pXG5leHBvcnQgY2xhc3MgQ3JlYXRlQ3VycmVuY3lQcmljZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgY29kZUZyb206IHN0cmluZztcbiAgICBjb2RlVG86IHN0cmluZztcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuXG4gICAgcGxhdGZvcm1MaXN0OiBWYWx1ZUxpc3Q8c3RyaW5nPiA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPihbXG4gICAgICAgIHsgdmFsdWU6IFwiYml0c3RhbXBcIiwgZGlzcGxheTogXCJCaXRzdGFtcFwiIH0sXG4gICAgICAgIHsgdmFsdWU6IFwiYml0ZmluZXhcIiwgZGlzcGxheTogXCJCaXRmaW5leFwiIH1cbiAgICBdKTtcbiAgICBzZWxlY3RlZEluZGV4UGxhdGZvcm1MaXN0OiBudW1iZXIgPSB0aGlzLnBsYXRmb3JtTGlzdC5nZXRJbmRleChcImJpdHN0YW1wXCIpO1xuXG4gICAgcGxhdGZvcm06IHN0cmluZyA9IHRoaXMucGxhdGZvcm1MaXN0LmdldFZhbHVlKHRoaXMuc2VsZWN0ZWRJbmRleFBsYXRmb3JtTGlzdCk7XG5cbiAgICBjdXJyZW5jeVN5bWJvbExpc3Q6IFZhbHVlTGlzdDxzdHJpbmc+O1xuICAgIHNlbGVjdGVkSW5kZXhDb2RlRnJvbTogbnVtYmVyO1xuICAgIHNlbGVjdGVkSW5kZXhDb2RlVG86IG51bWJlcjtcblxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjdXJyZW5jeVByaWNlU2VydmljZTogQ3VycmVuY3lQcmljZVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlckV4dGVuc2lvbjogUm91dGVyRXh0ZW5zaW9ucyxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHRyYW5zbGF0ZVNlcnZpY2U6IFRyYW5zbGF0ZVNlcnZpY2UpIHsgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuZmlsbFN5bWJvbHNMaXN0KFwiYml0c3RhbXBcIik7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3VycmVuY3lQcmljZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRlc2NyaXB0aW9uIHx8XG4gICAgICAgICAgICAhdGhpcy5jb2RlRnJvbSB8fFxuICAgICAgICAgICAgIXRoaXMuY29kZVRvIHx8XG4gICAgICAgICAgICAhdGhpcy5wbGF0Zm9ybSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoXCJlcnJvckZpbGxJbkFsbEZpZWxkc1wiKS5zdWJzY3JpYmUoKHRyYW5zbGF0ZWRUZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KHRyYW5zbGF0ZWRUZXh0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2UuY3JlYXRlQ3VycmVuY3lQcmljZSh0aGlzLmNvZGVGcm9tLCB0aGlzLmNvZGVUbywgdGhpcy5kZXNjcmlwdGlvbiwgdGhpcy5wbGF0Zm9ybSk7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVuY3lQcmljZVNlcnZpY2Uuc2F2ZUN1cnJlbmN5UHJpY2VzKCk7XG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbi5iYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblBsYXRmb3JtQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMucGxhdGZvcm0gPSB0aGlzLnBsYXRmb3JtTGlzdC5nZXRWYWx1ZShldmVudC5uZXdJbmRleCk7XG4gICAgICAgIHRoaXMuZmlsbFN5bWJvbHNMaXN0KHRoaXMucGxhdGZvcm0pO1xuICAgIH1cblxuICAgIG9uQ3VycmVuY3lDb2RlRnJvbUNoYW5nZShldmVudCkge1xuICAgICAgICB0aGlzLmNvZGVGcm9tID0gdGhpcy5jdXJyZW5jeVN5bWJvbExpc3QuZ2V0VmFsdWUoZXZlbnQubmV3SW5kZXgpO1xuICAgIH1cblxuICAgIG9uQ3VycmVuY3lDb2RlVG9DaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5jb2RlVG8gPSB0aGlzLmN1cnJlbmN5U3ltYm9sTGlzdC5nZXRWYWx1ZShldmVudC5uZXdJbmRleCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaWxsU3ltYm9sc0xpc3QocGxhdGZvcm06IHN0cmluZykge1xuICAgICAgICBsZXQgZGlzdGluY3RTeW1ib2xzID0gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXREaXN0aW5jdEN1cnJlbmN5U3ltYm9scyhwbGF0Zm9ybSk7XG4gICAgICAgIGxldCBuZXdWYWx1ZUxpc3QgPSBuZXcgVmFsdWVMaXN0PHN0cmluZz4oKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpc3RpbmN0U3ltYm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IG5ld1ZhbHVlSXRlbSA9IHsgdmFsdWU6IGRpc3RpbmN0U3ltYm9sc1tpXSwgZGlzcGxheTogZGlzdGluY3RTeW1ib2xzW2ldIH07XG4gICAgICAgICAgICBuZXdWYWx1ZUxpc3QucHVzaChuZXdWYWx1ZUl0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW5jeVN5bWJvbExpc3QgPSBuZXdWYWx1ZUxpc3Q7XG4gICAgfVxufSJdfQ==