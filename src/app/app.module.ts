import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Injector, NgModule } from "@angular/core";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";

import { environment } from "../environments/environment";
import {
  provideFirebaseApp,
  initializeApp,
  FirebaseApp,
} from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { TabsModule } from "ngx-bootstrap/tabs";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { AccordionModule } from "ngx-bootstrap/accordion";

import { CarouselModule } from "ngx-owl-carousel-o";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";

import { LayoutsModule } from "./layouts/layouts.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { ErrorInterceptor } from "./core/helpers/error.interceptor";
import { JwtInterceptor } from "./core/helpers/jwt.interceptor";
import { FakeBackendInterceptor } from "./core/helpers/fake-backend";
import { ToastrModule } from "ngx-toastr";
import { getDatabase, provideDatabase } from "@angular/fire/database";
import { SharedModule } from "./shared/shared.module";
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

const DATABASE_SHARD_URLS = [
  "https://tradingproject19-f513b.firebaseio.com", //0
  "https://tradingproject19-f513b-e8221tickersae-e8221.firebaseio.com", //1
  "https://tradingproject19-f513b-e8221tickersfl-e8221.firebaseio.com", // 2
  "https://tradingproject19-f513b-e8221tickersms-e8221.firebaseio.com", // 3
  "https://tradingproject19-f513b-e8221tickerstz-e8221.firebaseio.com", // 4
  "https://tradingproject19-f513b-e8221livesae-e8221.firebaseio.com", // 5
  "https://tradingproject19-f513b-e8221livesfl-e8221.firebaseio.com", // 6
  "https://tradingproject19-f513b-e8221livesms-e8221.firebaseio.com", // 7
  "https://tradingproject19-f513b-e8221livestz-e8221.firebaseio.com", // 8
  "https://tradingproject-futures.firebaseio.com", //9
  "https://tradingproject-futures-live.firebaseio.com", // 10
  "https://tradingproject-futures-blocks.firebaseio.com", // 11
  "https://tradingproject-futures-tracking.firebaseio.com", // 12
  "https://tradingproject19-f513b-e8221blocks-e8221.firebaseio.com", // 13
  "https://tradingproject19-f513b-e8221tracking-e8221.firebaseio.com", // 14
  "https://tradingproject19-twitter.firebaseio.com/", // 15
  "https://tradingproject19-calendar.firebaseio.com/", // 16
  "https://bilal-test-db.firebaseio.com/", //17
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[0])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[1])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[2])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[3])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[4])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[5])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[6])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[7])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[8])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[9])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[10])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[11])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[12])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[13])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[14])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[15])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[16])
    ),
    provideDatabase((inj: Injector) =>
      getDatabase(inj.get(FirebaseApp), DATABASE_SHARD_URLS[17])
    ),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    LayoutsModule,
    AppRoutingModule,
    CarouselModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ScrollToModule.forRoot(),
    ToastrModule.forRoot(),
    SharedModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true,
    },
    // LoaderService,
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
  ],
})
export class AppModule {}
