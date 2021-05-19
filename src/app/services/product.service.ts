import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../models/products.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map, switchMap, tap } from 'rxjs/operators';

interface Params {
  query: string;
  perPage: number;
  page: number;
  category: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  params = new BehaviorSubject<Params>({
    query: '',
    perPage: 5,
    page: 1,
    category: 0
  })

  total = new BehaviorSubject<Number>(0)

  state = {
    total: 0,
    pages: 1
  }

  setQuery(query) {
    this.params.next({
      ...this.params.getValue(),
      page: 1,
      query
    })
  }

  setPagination(page: number, perPage: number) {
    this.params.next({
      ...this.params.getValue(),
      page,
      perPage
    })
  }

  setCategory(category: number) {
    this.params.next({
      ...this.params.getValue(),
      category
    })
  }

  searchProducts() {
    return this.params.pipe(
      switchMap(params => this.http.get<any>(`${environment.API_URL}/products/search`, {
        params: {
          q: params.query,
          _limit: "" + params.perPage,
          _page: "" + params.page,
          _category: "" + params.category
        }
      })),
      tap(({ count }) => this.total.next(count)),
      map(({ products }) => products as Product[])
    )
  }

  searchExternalProducts(name: string) {
    return this.http.get<Product[]>(`${environment.API_URL}/external_products/${name}`)
  }

  update(product: Product) {
    return this.http.put<Product>(`${environment.API_URL}/products/${product.id}`, product)
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${environment.API_URL}/products/${id}`)
  }

  delete(productId: string) {
    return this.http.delete<Product>(`${environment.API_URL}/products/${productId}`)
  }

  insertMany(products: Product[]) {
    return this.http.post<Product>(`${environment.API_URL}/products`, products)
  }

  constructor(private http: HttpClient) { }
}
