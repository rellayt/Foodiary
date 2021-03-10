import { Component, OnInit, OnDestroy, Inject, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Product } from '../../models/products.model';
import { CATEGORIES_DATA } from '../../utility/static-data';
import { getCalory } from '../../utility/macro-calculations';
import { ProductService } from '../../services/product.service';
import { map } from 'rxjs/internal/operators/map';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { filter, finalize, first, switchMap, tap } from 'rxjs/operators';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DeleteDialogComponent } from '../../layout/dialogs/delete/delete-dialog.component';
import { endAnimation, startAnimation } from '../../utility/basic-animations';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { previousPage } from 'src/app/app.component';


@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductsListComponent implements OnInit, OnDestroy {

  @ViewChild('productList', { static: true }) productList: ElementRef;
  @ViewChild('productEdit') productEdit
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  dataSource = this.productService.searchProducts()
    .pipe(map(data => data.map(product =>
    ({
      ...product,
      calory: getCalory(product)
    }))
    ))

  columnsToDisplay = ['Nazwa produktu']
  expandedElement: Product | null
  categories = [...CATEGORIES_DATA];
  total = 0
  listProps = {
    query: '',
    category: 0,
    page: 1,
    perPage: 5,
  }

  focusedProduct: Product = null
  pageEvent: PageEvent
  enableHandlePaginator = false
  routerEvent: Subscription

  totalSubscription: Subscription

  constructor(private productService: ProductService, private dialog: MatDialog,
    private snackBar: SnackBarService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const value = previousPage === "/products/addition" ? 20 : 0
    startAnimation(this.productList.nativeElement, 0.35, value)

    this.routerEvent = this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event: any) => {
        const nextPage = event.url
        if (!nextPage.includes('?')) {
          const value = nextPage.split('/')[1] !== 'products' ? 0 : 20
          endAnimation(this.productList.nativeElement, 0.35, value)
        }
      });

    this.categories.unshift({ value: 0, viewValue: 'Brak' })
    this.totalSubscription = this.productService.total.subscribe(value => this.total = +value)

    this.route.queryParamMap.pipe(
      first(),
    ).subscribe(params => {
      this.listProps = {
        query: params.get('q') || '',
        category: +params.get('_category') || 0,
        page: +params.get('_page') || 1,
        perPage: +params.get('_perpage') || 5
      }

      setTimeout(() => this.paginator._changePageSize(this.listProps.perPage), 1)
      setTimeout(() => {
        this.paginator.pageIndex = this.listProps.page - 1
        this.enableHandlePaginator = true
      }, 1)

      this.productService.params.next({ ...this.listProps })
    })
  }

  ngOnDestroy(): void {
    this.routerEvent.unsubscribe()
    this.totalSubscription.unsubscribe()
    this.productService.params.next({
      query: '',
      perPage: 5,
      page: 1,
      category: 0
    })
  }

  search() {
    this.listProps = { ...this.listProps, page: 1 }
    this.router.navigate([], {
      queryParams: { q: this.listProps.query },
      queryParamsHandling: 'merge',
    })
    this.productService.setQuery(this.listProps.query)
    this.paginator.pageIndex = 0
  }

  handlePaginator(e: any) {
    if (this.enableHandlePaginator) {
      this.listProps = { ...this.listProps, page: e.pageIndex + 1, perPage: e.pageSize }
      this.router.navigate([], {
        queryParams: { _page: this.listProps.page, _perpage: this.listProps.perPage },
        queryParamsHandling: 'merge',
      })

      this.productService.setPagination(e.pageIndex + 1, e.pageSize)
    }
  }

  setCategory() {
    this.router.navigate([], {
      queryParams: { category: this.listProps.category },
      queryParamsHandling: 'merge',
    })

    this.productService.setCategory(this.listProps.category)
  }


  openEditMode(product: Product) {
    this.focusedProduct = null
    setTimeout(() => this.focusedProduct = product, 2)
    this.expandedElement = null;
  }

  delete(product: Product, elementRef: any) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        name: product.name,
        type: 'produkt'
      },
      disableClose: true,
      autoFocus: false
    })
    dialogRef.afterClosed().pipe(
      tap(() => elementRef._elementRef.nativeElement.blur()),
      filter(Boolean),
      switchMap(() => this.productService.delete(product.id))
    ).subscribe(res => {
      if (this.focusedProduct && this.focusedProduct.id === product.id) {
        endAnimation(this.productEdit.nativeElement, 0.45)
        setTimeout(() => this.focusedProduct = null, 450)
      }
      this.snackBar.open('Produkt został usunięty', 1500, true)
      this.productService.setQuery(this.listProps.query)
    })
  }

  handleEditorResult(result: boolean) {
    this.focusedProduct = null

    if (result) this.productService.setQuery(this.listProps.query)
  }

}

