import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProductsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${category}`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/${id}`, data);
  }

  getWishlist(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/wishlist/${userId}`);
  }

  addToWishlist(userId: string, productId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/wishlist`, { userId, productId });
  }

  removeFromWishlist(userId: string, productId: string): Observable<any> {
    // Angular HttpClient delete/request with body workaround
    return this.http.request('delete', `${this.baseUrl}/wishlist`, { body: { userId, productId } });
  }
  createProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/auth`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/auth/${id}`);
  }

  // Categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/categories`, category);
  }

  updateCategory(id: string, category: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }

  // Taxes
  getTaxes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/taxes`);
  }

  createTax(tax: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/taxes`, tax);
  }

  updateTax(id: string, tax: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/taxes/${id}`, tax);
  }

  deleteTax(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/taxes/${id}`);
  }
}
