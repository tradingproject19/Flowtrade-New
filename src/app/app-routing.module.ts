import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

import { AuthGuard } from "./core/guards/auth.guard";
import { LayoutComponent } from "./layouts/layout.component";
const routes: Routes = [
  {
    path: "account",
    loadChildren: () =>
      import("./account/account.module").then((m) => m.AccountModule),
  },
  // tslint:disable-next-line: max-line-length
  {
    path: "",
    component: LayoutComponent,
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
    canActivate: [AuthGuard],
  },
  {
    path: "charts",
    loadChildren: () =>
      import("./pages/charts/charts.module").then((m) => m.ChartsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "videos",
    component: LayoutComponent,
    loadChildren: () =>
      import("./pages/videos/videos.module").then((m) => m.VideosModule),
    canActivate: [AuthGuard],
  },
  {
    path: "options",
    component: LayoutComponent,
    loadChildren: () =>
      import("./pages/options/options.module").then((m) => m.OptionsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "chat",
    component: LayoutComponent,
    loadChildren: () =>
      import("./pages/chat/chat.module").then((m) => m.ChatModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "top",
      onSameUrlNavigation: "reload",
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
