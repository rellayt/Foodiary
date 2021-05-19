import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizedGuard } from '../auth/authorized.guard';
import { ProductsComponent } from './products.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { DelayResolve } from '../resolves/delay-resolve';
import { ProductsAdditionComponent } from './products-addition/products-addition.component';


const routes: Routes = [
  {
    path: 'products',
    redirectTo: 'products/list',
    pathMatch: 'full'
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [
      AuthorizedGuard
    ], children: [
      {
        path: 'list',
        component: ProductsListComponent,
        resolve: {
          'delay': DelayResolve,
        }
      },
      {
        path: 'addition',
        component: ProductsAdditionComponent,
        resolve: {
          'delay': DelayResolve,
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
export class ProductsRoutingModule { }
