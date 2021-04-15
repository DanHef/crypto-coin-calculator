import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { HomeComponent } from "./home/home.component";
import { CryptoPortfolioComponent } from "./crypto-portfolio/crypto-portfolio.component";
import { CreateCryptoPortfolioItemComponent } from "./crypto-portfolio/crypto-portfolio-item/create-crypto-portfolio-item/create-crypto-portfolio-item.component";

const routes: Routes = [
    { path: "", redirectTo: "/crypto-home", pathMatch: "full" },
    {
        path: "crypto-home", component: HomeComponent,
        children: [
        /*{
            path: "", redirectTo: "/crypto-portfolio", pathMatch: "full"
        },*/
        {
            path: "", component: CryptoPortfolioComponent,

        }, {
            path: "create-crypto-portfolio-item", component: CreateCryptoPortfolioItemComponent
        }]
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
