import { RegisterComponent } from './auth/register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { DiaryComponent } from './diary/diary.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthModule } from './auth/auth.module';
import { AuthorizedGuard } from './auth/authorized.guard';
import { UnauthorizedGuard } from './auth/unauthorized.guard';
import { AboutMeComponent } from './profile/about-me/about-me.component';
import { ProfileEditorComponent } from './profile/profile-editor/profile-editor.component';
import { SettingsComponent } from './profile/settings/settings.component';

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
  {
    path: 'profile',
    redirectTo: 'profile/about_me',
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [
      AuthorizedGuard
    ], children: [
      {
        path: 'about_me',
        component: AboutMeComponent
      },
      {
        path: 'edit',
        component: ProfileEditorComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AuthModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponents = [HomeComponent];
