"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var app_routing_1 = require("./app.routing");
var app_component_1 = require("./app.component");
var item_service_1 = require("./item/item.service");
var portfolio_item_service_1 = require("./item/services/portfolio-item.service");
var items_component_1 = require("./item/items.component");
var item_detail_component_1 = require("./item/item-detail.component");
var create_portfolio_item_component_1 = require("./item/create-portfolio-item/create-portfolio-item.component");
var create_currency_price_component_1 = require("./item/create-currency-price/create-currency-price.component");
var create_calculation_component_1 = require("./item/create-calculation/create-calculation.component");
var currency_price_service_1 = require("./item/services/currency-price.service");
var calculation_service_1 = require("./item/services/calculation.service");
// Uncomment and add to NgModule imports if you need to use two-way binding
var forms_1 = require("nativescript-angular/forms");
// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
var http_1 = require("nativescript-angular/http");
var AppModule = (function () {
    /*
    Pass your application module to the bootstrapModule function located in main.ts to start your app
    */
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [
                app_component_1.AppComponent
            ],
            imports: [
                nativescript_module_1.NativeScriptModule,
                app_routing_1.AppRoutingModule,
                forms_1.NativeScriptFormsModule,
                http_1.NativeScriptHttpModule
            ],
            declarations: [
                app_component_1.AppComponent,
                items_component_1.ItemsComponent,
                item_detail_component_1.ItemDetailComponent,
                create_portfolio_item_component_1.CreatePortfolioItemComponent,
                create_currency_price_component_1.CreateCurrencyPriceComponent,
                create_calculation_component_1.CreateCalculationComponent
            ],
            providers: [
                item_service_1.ItemService,
                portfolio_item_service_1.PortfolioItemService,
                currency_price_service_1.CurrencyPriceService,
                calculation_service_1.CalculationService
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ],
            entryComponents: []
        })
        /*
        Pass your application module to the bootstrapModule function located in main.ts to start your app
        */
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0QsZ0ZBQThFO0FBQzlFLDZDQUFpRDtBQUNqRCxpREFBK0M7QUFFL0Msb0RBQWtEO0FBQ2xELGlGQUE4RTtBQUM5RSwwREFBd0Q7QUFDeEQsc0VBQW1FO0FBQ25FLGdIQUE0RztBQUM1RyxnSEFBNEc7QUFDNUcsdUdBQW9HO0FBQ3BHLGlGQUE4RTtBQUM5RSwyRUFBeUU7QUFPekUsMkVBQTJFO0FBQzNFLG9EQUFxRTtBQUVyRSw2RUFBNkU7QUFDN0Usa0RBQW1FO0FBb0NuRTtJQUhBOztNQUVFO0lBQ0Y7SUFBeUIsQ0FBQztJQUFiLFNBQVM7UUFoQ3JCLGVBQVEsQ0FBQztZQUNOLFNBQVMsRUFBRTtnQkFDUCw0QkFBWTthQUNmO1lBQ0QsT0FBTyxFQUFFO2dCQUNMLHdDQUFrQjtnQkFDbEIsOEJBQWdCO2dCQUNoQiwrQkFBdUI7Z0JBQ3ZCLDZCQUFzQjthQUN6QjtZQUNELFlBQVksRUFBRTtnQkFDViw0QkFBWTtnQkFDWixnQ0FBYztnQkFDZCwyQ0FBbUI7Z0JBQ25CLDhEQUE0QjtnQkFDNUIsOERBQTRCO2dCQUM1Qix5REFBMEI7YUFDN0I7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsMEJBQVc7Z0JBQ1gsNkNBQW9CO2dCQUNwQiw2Q0FBb0I7Z0JBQ3BCLHdDQUFrQjthQUNyQjtZQUNELE9BQU8sRUFBRTtnQkFDTCx1QkFBZ0I7YUFDbkI7WUFDRCxlQUFlLEVBQUUsRUFBRTtTQUN0QixDQUFDO1FBQ0Y7O1VBRUU7T0FDVyxTQUFTLENBQUk7SUFBRCxnQkFBQztDQUFBLEFBQTFCLElBQTBCO0FBQWIsOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbmF0aXZlc2NyaXB0Lm1vZHVsZVwiO1xuaW1wb3J0IHsgQXBwUm91dGluZ01vZHVsZSB9IGZyb20gXCIuL2FwcC5yb3V0aW5nXCI7XG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tIFwiLi9hcHAuY29tcG9uZW50XCI7XG5cbmltcG9ydCB7IEl0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vaXRlbS9pdGVtLnNlcnZpY2VcIjtcbmltcG9ydCB7IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vaXRlbS9zZXJ2aWNlcy9wb3J0Zm9saW8taXRlbS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBJdGVtc0NvbXBvbmVudCB9IGZyb20gXCIuL2l0ZW0vaXRlbXMuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBJdGVtRGV0YWlsQ29tcG9uZW50IH0gZnJvbSBcIi4vaXRlbS9pdGVtLWRldGFpbC5jb21wb25lbnRcIjtcbmltcG9ydCB7IENyZWF0ZVBvcnRmb2xpb0l0ZW1Db21wb25lbnQgfSBmcm9tIFwiLi9pdGVtL2NyZWF0ZS1wb3J0Zm9saW8taXRlbS9jcmVhdGUtcG9ydGZvbGlvLWl0ZW0uY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDcmVhdGVDdXJyZW5jeVByaWNlQ29tcG9uZW50IH0gZnJvbSBcIi4vaXRlbS9jcmVhdGUtY3VycmVuY3ktcHJpY2UvY3JlYXRlLWN1cnJlbmN5LXByaWNlLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ3JlYXRlQ2FsY3VsYXRpb25Db21wb25lbnQgfSBmcm9tIFwiLi9pdGVtL2NyZWF0ZS1jYWxjdWxhdGlvbi9jcmVhdGUtY2FsY3VsYXRpb24uY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlU2VydmljZSB9IGZyb20gXCIuL2l0ZW0vc2VydmljZXMvY3VycmVuY3ktcHJpY2Uuc2VydmljZVwiO1xuaW1wb3J0IHsgQ2FsY3VsYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4vaXRlbS9zZXJ2aWNlcy9jYWxjdWxhdGlvbi5zZXJ2aWNlXCI7XG5cbmltcG9ydCAqIGFzIGVsZW1lbnRSZWdpc3RyeU1vZHVsZSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9lbGVtZW50LXJlZ2lzdHJ5JztcbmltcG9ydCAqIGFzIEFkbW9iIGZyb20gXCJuYXRpdmVzY3JpcHQtYWRtb2JcIjtcblxuaW1wb3J0ICogYXMgcGxhdGZvcm1Nb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvcGxhdGZvcm1cIjtcblxuLy8gVW5jb21tZW50IGFuZCBhZGQgdG8gTmdNb2R1bGUgaW1wb3J0cyBpZiB5b3UgbmVlZCB0byB1c2UgdHdvLXdheSBiaW5kaW5nXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9mb3Jtc1wiO1xuXG4vLyBVbmNvbW1lbnQgYW5kIGFkZCB0byBOZ01vZHVsZSBpbXBvcnRzICBpZiB5b3UgbmVlZCB0byB1c2UgdGhlIEhUVFAgd3JhcHBlclxuaW1wb3J0IHsgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9odHRwXCI7XG5cblxuXG5ATmdNb2R1bGUoe1xuICAgIGJvb3RzdHJhcDogW1xuICAgICAgICBBcHBDb21wb25lbnRcbiAgICBdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxuICAgICAgICBBcHBSb3V0aW5nTW9kdWxlLFxuICAgICAgICBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSxcbiAgICAgICAgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIEFwcENvbXBvbmVudCxcbiAgICAgICAgSXRlbXNDb21wb25lbnQsXG4gICAgICAgIEl0ZW1EZXRhaWxDb21wb25lbnQsXG4gICAgICAgIENyZWF0ZVBvcnRmb2xpb0l0ZW1Db21wb25lbnQsXG4gICAgICAgIENyZWF0ZUN1cnJlbmN5UHJpY2VDb21wb25lbnQsXG4gICAgICAgIENyZWF0ZUNhbGN1bGF0aW9uQ29tcG9uZW50XG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgSXRlbVNlcnZpY2UsXG4gICAgICAgIFBvcnRmb2xpb0l0ZW1TZXJ2aWNlLFxuICAgICAgICBDdXJyZW5jeVByaWNlU2VydmljZSxcbiAgICAgICAgQ2FsY3VsYXRpb25TZXJ2aWNlXG4gICAgXSxcbiAgICBzY2hlbWFzOiBbXG4gICAgICAgIE5PX0VSUk9SU19TQ0hFTUFcbiAgICBdLFxuICAgIGVudHJ5Q29tcG9uZW50czogW11cbn0pXG4vKlxuUGFzcyB5b3VyIGFwcGxpY2F0aW9uIG1vZHVsZSB0byB0aGUgYm9vdHN0cmFwTW9kdWxlIGZ1bmN0aW9uIGxvY2F0ZWQgaW4gbWFpbi50cyB0byBzdGFydCB5b3VyIGFwcFxuKi9cbmV4cG9ydCBjbGFzcyBBcHBNb2R1bGUgeyB9XG4iXX0=