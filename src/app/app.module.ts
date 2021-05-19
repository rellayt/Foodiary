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
import { QuestionnaireComponent } from './home/questionnaire/questionnaire.component';
import { WildcardComponent } from './wildcard/wildcard.component';
import { AuthService } from './auth/auth.service';


@NgModule({
  declarations: [
    AppComponent,
    QuestionnaireComponent,
    LogoComponent,
    BackgroundComponent,
    RoutingComponents,
    SubNavigationComponent,
    GuestNavbarComponent,
    UserNavbarComponent,
    DeleteDialogComponent,
    WildcardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DiaryModule,
    ProfileModule,
    DirectivesModule,
    BrowserAnimationsModule,
    ValidationModule,
    AuthModule,
    ProductsModule,
    MealTemplateModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],

  providers: [
    UnauthorizedGuard,
    AuthorizedGuard,
    AuthorizedGuard,
    CookieService,
    ValidationService,
    DelayResolve,
    AuthService,
    { provide: MatPaginatorIntl, useValue: getPolishPaginatorIntl() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private authService: AuthService) {
    this.authService.authenticate()
  }
}
