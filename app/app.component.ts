import { Component } from "@angular/core";
import * as Admob from "nativescript-admob";
import * as Platform from "platform";

import { registerElement } from "nativescript-angular/element-registry";
import { TranslateService } from "ng2-translate";
registerElement("PullToRefresh", () => require("nativescript-pulltorefresh").PullToRefresh);

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent {
    public language: string;

    public constructor(private translate: TranslateService) {
        this.language = Platform.device.language;
        this.translate.setDefaultLang("en");
        this.translate.use(Platform.device.language.split("-")[0]);
    }
 }
