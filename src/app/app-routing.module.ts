import { RegisterComponent } from './mainApp/myAccount/register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './mainApp/welcome/welcome.component';
import { LoginComponent } from './mainApp/myAccount/login/login.component';
import { ForgotPasswordComponent } from './mainApp/myAccount/login/forgot-password/forgot-password.component';
import { DiaryComponent } from './mainApp/mainPage/diary/diary.component';
import { ProfileComponent } from './mainApp/mainPage/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'my-account/login', component: LoginComponent },
  { path: 'my-account/register', component: RegisterComponent },
  { path: 'my-account/forgot-password', component: ForgotPasswordComponent },
  { path: 'diary', component: DiaryComponent },
  { path: 'profile', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponents = [WelcomeComponent, LoginComponent, RegisterComponent, ForgotPasswordComponent];
