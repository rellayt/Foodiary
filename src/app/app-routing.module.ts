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
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [
      UnauthorizedGuard
    ]
  },
  {
    path: 'diary',
    component: DiaryComponent,
    canActivate: [
      AuthorizedGuard
    ]
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
