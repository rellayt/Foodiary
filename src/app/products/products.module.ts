import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelayResolve } from '../resolves/delay-resolve';
import { ProductsComponent } from '../products/products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ProductsNavigationComponent } from './products-navigation/products-navigation.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsAdditionComponent } from './products-addition/products-addition.component';
import { DirectivesModule } from '../directives/directives.module';
import { ValidationModule } from '../validation/validation.module';
import { ProductEditorComponent } from './products-list/product-editor/product-editor.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductsNavigationComponent,
    ProductsListComponent,
    ProductsAdditionComponent,
    ProductEditorComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ValidationModule,
    DirectivesModule
  ],
  exports: [

  ],
  providers: [
    DelayResolve
  ]
})
export class ProductsModule { }
