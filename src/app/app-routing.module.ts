import { RegisterComponent } from './auth/register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { DiaryComponent } from './diary/diary.component';
import { AuthModule } from './auth/auth.module';
import { AuthorizedGuard } from './auth/authorized.guard';
import { UnauthorizedGuard } from './auth/unauthorized.guard';
import { QuestionnaireComponent } from './home/questionnaire/questionnaire.component';
import { RegisterExtendedComponent } from './auth/register-extended/register-extended.component';
import { WildcardComponent } from './wildcard/wildcard.component';
import { AboutMeComponent } from './profile/about-me/about-me.component';
import { RegisterExtendedGuard } from './auth/register-extended.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [
      UnauthorizedGuard
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      UnauthorizedGuard
    ]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [
      UnauthorizedGuard
    ]
  },
  {
    path: 'register_extended',
    component: RegisterExtendedComponent,
    canActivate: [
      UnauthorizedGuard,
      RegisterExtendedGuard

    ]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [
      UnauthorizedGuard
    ]
  },
  {
    path: 'questionnaire',
    component: QuestionnaireComponent,
    canActivate: [
      UnauthorizedGuard,
    ]
  },
  // {
  //   path: 'profile',
  //   redirectTo: 'profile/about_me',
  // },
  {
    path: '**',
    component: WildcardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    // { enableTracing: true }
  ), AuthModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponents = [HomeComponent];
