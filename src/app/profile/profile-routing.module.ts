import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { AuthorizedGuard } from '../auth/authorized.guard';
import { AboutMeComponent } from './about-me/about-me.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { SettingsComponent } from './settings/settings.component';

import { DelayResolve } from '../resolves/delay-resolve';
import { MacroResolve } from '../resolves/macro-resolve';

const routes: Routes = [
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
        component: AboutMeComponent,
        resolve: {
          'delay': DelayResolve,
          'macro': MacroResolve
        }
      },
      {
        path: 'edit',
        component: ProfileEditorComponent,
        resolve: {
          'delay': DelayResolve,
          'macro': MacroResolve
        }
      },
      {
        path: 'settings',
        component: SettingsComponent,
        resolve: {
          'delay': DelayResolve
        }
      }
    ]
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProfileRoutingModule { }
