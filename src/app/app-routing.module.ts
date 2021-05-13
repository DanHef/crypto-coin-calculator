import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { HomeComponent } from "./home/home.component";
import { CryptoPortfolioComponent } from "./crypto-portfolio/crypto-portfolio.component";
import { CreateCryptoPortfolioItemComponent } from "./crypto-portfolio/crypto-portfolio-item/create-crypto-portfolio-item/create-crypto-portfolio-item.component";
import { CryptoPlatformPricesComponent } from "./crypto-platform/crypto-platform-prices/crypto-platform-prices.component";
import { CreateCryptoPlatformPriceComponent } from "./crypto-platform/create-crypto-platform-price/create-crypto-platform-price.component";
import { CryptoCalculationOverviewComponent } from "./crypto-calculation/crypto-calculation-overview/crypto-calculation-overview.component";

const routes: Routes = [
    { path: "", redirectTo: "/crypto-home", pathMatch: "full" },
    {
        path: "crypto-home", component: HomeComponent,
        children: [
            {
                path: "", component: CryptoPortfolioComponent, outlet: 'cryptoPortfolio'
            }, {
                path: "create-crypto-portfolio-item", component: CreateCryptoPortfolioItemComponent, outlet: 'cryptoPortfolio'
            },
            {
                path: "", component: CryptoPlatformPricesComponent, outlet: 'crypto-platform'
            }, {
                path: "create-crypto-platform-price", component: CreateCryptoPlatformPriceComponent, outlet: 'crypto-platform'
            },
            {
                path: "", component: CryptoCalculationOverviewComponent, outlet: 'crypto-calculations'
            }, /*{
            path: "create-crypto-platform-price", component: CreateCryptoPlatformPriceComponent, outlet: 'crypto-calculations'
        }*/
        ]
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
