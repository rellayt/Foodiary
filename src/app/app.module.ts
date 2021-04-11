import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LogoComponent } from './layout/logo/logo.component';
import { BackgroundComponent } from './layout/background/background.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SubNavigationComponent } from './layout/sub-navigation/sub-navigation.component';
import { GuestNavbarComponent } from './layout/headers/guest-navbar/guest-navbar.component';
import { UserNavbarComponent } from './layout/headers/user-navbar/user-navbar.component';
import { AuthModule } from './auth/auth.module';
import { ValidationModule } from './validation/validation.module';
import { ValidationService } from './validation/validation.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthorizedGuard } from './auth/authorized.guard';
import { UnauthorizedGuard } from './auth/unauthorized.guard';
import { ProfileModule } from './profile/profile.module';
import { ProductsModule } from './products/products.module';
import { DelayResolve } from './resolves/delay-resolve';
import { DirectivesModule } from './directives/directives.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getPolishPaginatorIntl } from '../polish-paginator-intl';
import { MealTemplateModule } from './meal-template/meal-template.module';
import { DeleteDialogComponent } from './layout/dialogs/delete/delete-dialog.component';
import { DiaryModule } from './diary/diary.module';


@NgModule({
  declarations: [
    AppComponent,
    LogoComponent,
    BackgroundComponent,
    RoutingComponents,
    SubNavigationComponent,
    GuestNavbarComponent,
    UserNavbarComponent,
    DeleteDialogComponent
  ],
  imports: [
    BrowserModule,
    DiaryModule,
    AppRoutingModule,
    DirectivesModule,
    BrowserAnimationsModule,
    ValidationModule,
    AuthModule,
    ProfileModule,
    ProductsModule,
    MealTemplateModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],

  providers: [
    UnauthorizedGuard,
    AuthorizedGuard,
    CookieService,
    ValidationService,
    DelayResolve,
    { provide: MatPaginatorIntl, useValue: getPolishPaginatorIntl() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() { }
}
