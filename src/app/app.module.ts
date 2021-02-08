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
import { DiaryComponent } from './diary/diary.component';
import { SubNavigationComponent } from './layout/sub-navigation/sub-navigation.component';
import { CommaReplacerDirective } from './directives/replacer.directive';
import { GuestNavbarComponent } from './layout/headers/guest-navbar/guest-navbar.component';
import { UserNavbarComponent } from './layout/headers/user-navbar/user-navbar.component';
import { AuthModule } from './auth/auth.module';
import { ValidationModule } from './validation/validation.module';
import { ValidationService } from './validation/validation.service';
import { AuthService } from './auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthorizedGuard } from './auth/authorized.guard';
import { UnauthorizedGuard } from './auth/unauthorized.guard';
import { ProfileModule } from './profile/profile.module';


@NgModule({
  declarations: [
    AppComponent,
    LogoComponent,
    BackgroundComponent,
    RoutingComponents,
    DiaryComponent,
    SubNavigationComponent,
    CommaReplacerDirective,
    GuestNavbarComponent,
    UserNavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ValidationModule,
    AuthModule,
    ProfileModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [UnauthorizedGuard, AuthorizedGuard, CookieService, ValidationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private auth: AuthService, private cookieService: CookieService) {
    const token = this.cookieService.get('token')
    if (token) {
      this.auth.getUser(token)
    }
  }
}
