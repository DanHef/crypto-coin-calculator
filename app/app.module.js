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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0QsZ0ZBQThFO0FBQzlFLDZDQUFpRDtBQUNqRCxpREFBK0M7QUFFL0Msb0RBQWtEO0FBQ2xELGlGQUE4RTtBQUM5RSwwREFBd0Q7QUFDeEQsc0VBQW1FO0FBQ25FLGdIQUE0RztBQUM1RyxnSEFBNEc7QUFDNUcsdUdBQW9HO0FBQ3BHLGlGQUE4RTtBQUM5RSwyRUFBeUU7QUFDekUscUVBQW1FO0FBT25FLDJFQUEyRTtBQUMzRSxvREFBcUU7QUFFckUsNkVBQTZFO0FBQzdFLGtEQUFtRTtBQXFDbkU7SUFIQTs7TUFFRTtJQUNGO0lBQXlCLENBQUM7SUFBYixTQUFTO1FBakNyQixlQUFRLENBQUM7WUFDTixTQUFTLEVBQUU7Z0JBQ1AsNEJBQVk7YUFDZjtZQUNELE9BQU8sRUFBRTtnQkFDTCx3Q0FBa0I7Z0JBQ2xCLDhCQUFnQjtnQkFDaEIsK0JBQXVCO2dCQUN2Qiw2QkFBc0I7YUFDekI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1YsNEJBQVk7Z0JBQ1osZ0NBQWM7Z0JBQ2QsMkNBQW1CO2dCQUNuQiw4REFBNEI7Z0JBQzVCLDhEQUE0QjtnQkFDNUIseURBQTBCO2FBQzdCO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLDBCQUFXO2dCQUNYLDZDQUFvQjtnQkFDcEIsNkNBQW9CO2dCQUNwQix3Q0FBa0I7Z0JBQ2xCLGtDQUFlO2FBQ2xCO1lBQ0QsT0FBTyxFQUFFO2dCQUNMLHVCQUFnQjthQUNuQjtZQUNELGVBQWUsRUFBRSxFQUFFO1NBQ3RCLENBQUM7UUFDRjs7VUFFRTtPQUNXLFNBQVMsQ0FBSTtJQUFELGdCQUFDO0NBQUEsQUFBMUIsSUFBMEI7QUFBYiw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgeyBBcHBSb3V0aW5nTW9kdWxlIH0gZnJvbSBcIi4vYXBwLnJvdXRpbmdcIjtcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gXCIuL2FwcC5jb21wb25lbnRcIjtcblxuaW1wb3J0IHsgSXRlbVNlcnZpY2UgfSBmcm9tIFwiLi9pdGVtL2l0ZW0uc2VydmljZVwiO1xuaW1wb3J0IHsgUG9ydGZvbGlvSXRlbVNlcnZpY2UgfSBmcm9tIFwiLi9pdGVtL3NlcnZpY2VzL3BvcnRmb2xpby1pdGVtLnNlcnZpY2VcIjtcbmltcG9ydCB7IEl0ZW1zQ29tcG9uZW50IH0gZnJvbSBcIi4vaXRlbS9pdGVtcy5jb21wb25lbnRcIjtcbmltcG9ydCB7IEl0ZW1EZXRhaWxDb21wb25lbnQgfSBmcm9tIFwiLi9pdGVtL2l0ZW0tZGV0YWlsLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ3JlYXRlUG9ydGZvbGlvSXRlbUNvbXBvbmVudCB9IGZyb20gXCIuL2l0ZW0vY3JlYXRlLXBvcnRmb2xpby1pdGVtL2NyZWF0ZS1wb3J0Zm9saW8taXRlbS5jb21wb25lbnRcIjtcbmltcG9ydCB7IENyZWF0ZUN1cnJlbmN5UHJpY2VDb21wb25lbnQgfSBmcm9tIFwiLi9pdGVtL2NyZWF0ZS1jdXJyZW5jeS1wcmljZS9jcmVhdGUtY3VycmVuY3ktcHJpY2UuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDcmVhdGVDYWxjdWxhdGlvbkNvbXBvbmVudCB9IGZyb20gXCIuL2l0ZW0vY3JlYXRlLWNhbGN1bGF0aW9uL2NyZWF0ZS1jYWxjdWxhdGlvbi5jb21wb25lbnRcIjtcbmltcG9ydCB7IEN1cnJlbmN5UHJpY2VTZXJ2aWNlIH0gZnJvbSBcIi4vaXRlbS9zZXJ2aWNlcy9jdXJyZW5jeS1wcmljZS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDYWxjdWxhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi9pdGVtL3NlcnZpY2VzL2NhbGN1bGF0aW9uLnNlcnZpY2VcIjtcbmltcG9ydCB7IFBsYXRmb3JtU2VydmljZSB9IGZyb20gXCIuL2l0ZW0vc2VydmljZXMvcGxhdGZvcm0uc2VydmljZVwiO1xuXG5pbXBvcnQgKiBhcyBlbGVtZW50UmVnaXN0cnlNb2R1bGUgZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XG5pbXBvcnQgKiBhcyBBZG1vYiBmcm9tIFwibmF0aXZlc2NyaXB0LWFkbW9iXCI7XG5cbmltcG9ydCAqIGFzIHBsYXRmb3JtTW9kdWxlIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3BsYXRmb3JtXCI7XG5cbi8vIFVuY29tbWVudCBhbmQgYWRkIHRvIE5nTW9kdWxlIGltcG9ydHMgaWYgeW91IG5lZWQgdG8gdXNlIHR3by13YXkgYmluZGluZ1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcblxuLy8gVW5jb21tZW50IGFuZCBhZGQgdG8gTmdNb2R1bGUgaW1wb3J0cyAgaWYgeW91IG5lZWQgdG8gdXNlIHRoZSBIVFRQIHdyYXBwZXJcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuXG5cblxuQE5nTW9kdWxlKHtcbiAgICBib290c3RyYXA6IFtcbiAgICAgICAgQXBwQ29tcG9uZW50XG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIE5hdGl2ZVNjcmlwdE1vZHVsZSxcbiAgICAgICAgQXBwUm91dGluZ01vZHVsZSxcbiAgICAgICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGVcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBBcHBDb21wb25lbnQsXG4gICAgICAgIEl0ZW1zQ29tcG9uZW50LFxuICAgICAgICBJdGVtRGV0YWlsQ29tcG9uZW50LFxuICAgICAgICBDcmVhdGVQb3J0Zm9saW9JdGVtQ29tcG9uZW50LFxuICAgICAgICBDcmVhdGVDdXJyZW5jeVByaWNlQ29tcG9uZW50LFxuICAgICAgICBDcmVhdGVDYWxjdWxhdGlvbkNvbXBvbmVudFxuICAgIF0sXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIEl0ZW1TZXJ2aWNlLFxuICAgICAgICBQb3J0Zm9saW9JdGVtU2VydmljZSxcbiAgICAgICAgQ3VycmVuY3lQcmljZVNlcnZpY2UsXG4gICAgICAgIENhbGN1bGF0aW9uU2VydmljZSxcbiAgICAgICAgUGxhdGZvcm1TZXJ2aWNlXG4gICAgXSxcbiAgICBzY2hlbWFzOiBbXG4gICAgICAgIE5PX0VSUk9SU19TQ0hFTUFcbiAgICBdLFxuICAgIGVudHJ5Q29tcG9uZW50czogW11cbn0pXG4vKlxuUGFzcyB5b3VyIGFwcGxpY2F0aW9uIG1vZHVsZSB0byB0aGUgYm9vdHN0cmFwTW9kdWxlIGZ1bmN0aW9uIGxvY2F0ZWQgaW4gbWFpbi50cyB0byBzdGFydCB5b3VyIGFwcFxuKi9cbmV4cG9ydCBjbGFzcyBBcHBNb2R1bGUgeyB9XG4iXX0=