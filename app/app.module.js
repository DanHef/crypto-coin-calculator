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
var platform_service_1 = require("./item/services/platform.service");
var angular_1 = require("nativescript-drop-down/angular");
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
                http_1.NativeScriptHttpModule,
                angular_1.DropDownModule
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
                calculation_service_1.CalculationService,
                platform_service_1.PlatformService
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0QsZ0ZBQThFO0FBQzlFLDZDQUFpRDtBQUNqRCxpREFBK0M7QUFFL0Msb0RBQWtEO0FBQ2xELGlGQUE4RTtBQUM5RSwwREFBd0Q7QUFDeEQsc0VBQW1FO0FBQ25FLGdIQUE0RztBQUM1RyxnSEFBNEc7QUFDNUcsdUdBQW9HO0FBQ3BHLGlGQUE4RTtBQUM5RSwyRUFBeUU7QUFDekUscUVBQW1FO0FBRW5FLDBEQUFnRTtBQU9oRSwyRUFBMkU7QUFDM0Usb0RBQXFFO0FBRXJFLDZFQUE2RTtBQUM3RSxrREFBbUU7QUFzQ25FO0lBSEE7O01BRUU7SUFDRjtJQUF5QixDQUFDO0lBQWIsU0FBUztRQWxDckIsZUFBUSxDQUFDO1lBQ04sU0FBUyxFQUFFO2dCQUNQLDRCQUFZO2FBQ2Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsd0NBQWtCO2dCQUNsQiw4QkFBZ0I7Z0JBQ2hCLCtCQUF1QjtnQkFDdkIsNkJBQXNCO2dCQUN0Qix3QkFBYzthQUNqQjtZQUNELFlBQVksRUFBRTtnQkFDViw0QkFBWTtnQkFDWixnQ0FBYztnQkFDZCwyQ0FBbUI7Z0JBQ25CLDhEQUE0QjtnQkFDNUIsOERBQTRCO2dCQUM1Qix5REFBMEI7YUFDN0I7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsMEJBQVc7Z0JBQ1gsNkNBQW9CO2dCQUNwQiw2Q0FBb0I7Z0JBQ3BCLHdDQUFrQjtnQkFDbEIsa0NBQWU7YUFDbEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsdUJBQWdCO2FBQ25CO1lBQ0QsZUFBZSxFQUFFLEVBQUU7U0FDdEIsQ0FBQztRQUNGOztVQUVFO09BQ1csU0FBUyxDQUFJO0lBQUQsZ0JBQUM7Q0FBQSxBQUExQixJQUEwQjtBQUFiLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE5PX0VSUk9SU19TQ0hFTUEgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IEFwcFJvdXRpbmdNb2R1bGUgfSBmcm9tIFwiLi9hcHAucm91dGluZ1wiO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSBcIi4vYXBwLmNvbXBvbmVudFwiO1xuXG5pbXBvcnQgeyBJdGVtU2VydmljZSB9IGZyb20gXCIuL2l0ZW0vaXRlbS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBQb3J0Zm9saW9JdGVtU2VydmljZSB9IGZyb20gXCIuL2l0ZW0vc2VydmljZXMvcG9ydGZvbGlvLWl0ZW0uc2VydmljZVwiO1xuaW1wb3J0IHsgSXRlbXNDb21wb25lbnQgfSBmcm9tIFwiLi9pdGVtL2l0ZW1zLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgSXRlbURldGFpbENvbXBvbmVudCB9IGZyb20gXCIuL2l0ZW0vaXRlbS1kZXRhaWwuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDcmVhdGVQb3J0Zm9saW9JdGVtQ29tcG9uZW50IH0gZnJvbSBcIi4vaXRlbS9jcmVhdGUtcG9ydGZvbGlvLWl0ZW0vY3JlYXRlLXBvcnRmb2xpby1pdGVtLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ3JlYXRlQ3VycmVuY3lQcmljZUNvbXBvbmVudCB9IGZyb20gXCIuL2l0ZW0vY3JlYXRlLWN1cnJlbmN5LXByaWNlL2NyZWF0ZS1jdXJyZW5jeS1wcmljZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IENyZWF0ZUNhbGN1bGF0aW9uQ29tcG9uZW50IH0gZnJvbSBcIi4vaXRlbS9jcmVhdGUtY2FsY3VsYXRpb24vY3JlYXRlLWNhbGN1bGF0aW9uLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ3VycmVuY3lQcmljZVNlcnZpY2UgfSBmcm9tIFwiLi9pdGVtL3NlcnZpY2VzL2N1cnJlbmN5LXByaWNlLnNlcnZpY2VcIjtcbmltcG9ydCB7IENhbGN1bGF0aW9uU2VydmljZSB9IGZyb20gXCIuL2l0ZW0vc2VydmljZXMvY2FsY3VsYXRpb24uc2VydmljZVwiO1xuaW1wb3J0IHsgUGxhdGZvcm1TZXJ2aWNlIH0gZnJvbSBcIi4vaXRlbS9zZXJ2aWNlcy9wbGF0Zm9ybS5zZXJ2aWNlXCI7XG5cbmltcG9ydCB7IERyb3BEb3duTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1kcm9wLWRvd24vYW5ndWxhclwiO1xuXG5pbXBvcnQgKiBhcyBlbGVtZW50UmVnaXN0cnlNb2R1bGUgZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XG5pbXBvcnQgKiBhcyBBZG1vYiBmcm9tIFwibmF0aXZlc2NyaXB0LWFkbW9iXCI7XG5cbmltcG9ydCAqIGFzIHBsYXRmb3JtTW9kdWxlIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3BsYXRmb3JtXCI7XG5cbi8vIFVuY29tbWVudCBhbmQgYWRkIHRvIE5nTW9kdWxlIGltcG9ydHMgaWYgeW91IG5lZWQgdG8gdXNlIHR3by13YXkgYmluZGluZ1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcblxuLy8gVW5jb21tZW50IGFuZCBhZGQgdG8gTmdNb2R1bGUgaW1wb3J0cyAgaWYgeW91IG5lZWQgdG8gdXNlIHRoZSBIVFRQIHdyYXBwZXJcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuXG5cblxuQE5nTW9kdWxlKHtcbiAgICBib290c3RyYXA6IFtcbiAgICAgICAgQXBwQ29tcG9uZW50XG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIE5hdGl2ZVNjcmlwdE1vZHVsZSxcbiAgICAgICAgQXBwUm91dGluZ01vZHVsZSxcbiAgICAgICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgICAgIERyb3BEb3duTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgQXBwQ29tcG9uZW50LFxuICAgICAgICBJdGVtc0NvbXBvbmVudCxcbiAgICAgICAgSXRlbURldGFpbENvbXBvbmVudCxcbiAgICAgICAgQ3JlYXRlUG9ydGZvbGlvSXRlbUNvbXBvbmVudCxcbiAgICAgICAgQ3JlYXRlQ3VycmVuY3lQcmljZUNvbXBvbmVudCxcbiAgICAgICAgQ3JlYXRlQ2FsY3VsYXRpb25Db21wb25lbnRcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICBJdGVtU2VydmljZSxcbiAgICAgICAgUG9ydGZvbGlvSXRlbVNlcnZpY2UsXG4gICAgICAgIEN1cnJlbmN5UHJpY2VTZXJ2aWNlLFxuICAgICAgICBDYWxjdWxhdGlvblNlcnZpY2UsXG4gICAgICAgIFBsYXRmb3JtU2VydmljZVxuICAgIF0sXG4gICAgc2NoZW1hczogW1xuICAgICAgICBOT19FUlJPUlNfU0NIRU1BXG4gICAgXSxcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtdXG59KVxuLypcblBhc3MgeW91ciBhcHBsaWNhdGlvbiBtb2R1bGUgdG8gdGhlIGJvb3RzdHJhcE1vZHVsZSBmdW5jdGlvbiBsb2NhdGVkIGluIG1haW4udHMgdG8gc3RhcnQgeW91ciBhcHBcbiovXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuIl19