import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api/products';

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
    return this.http.put(`http://localhost:5000/api/auth/${id}`, data);
  }

  getWishlist(userId: string): Observable<any> {
    return this.http.get(`http://localhost:5000/api/wishlist/${userId}`);
  }

  addToWishlist(userId: string, productId: string): Observable<any> {
    return this.http.post(`http://localhost:5000/api/wishlist`, { userId, productId });
  }

  removeFromWishlist(userId: string, productId: string): Observable<any> {
    // Angular HttpClient delete/request with body workaround
    return this.http.request('delete', `http://localhost:5000/api/wishlist`, { body: { userId, productId } });
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
    return this.http.get<any[]>('http://localhost:5000/api/auth');
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/api/auth/${id}`);
  }

  // Categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5000/api/categories');
  }

  createCategory(category: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/categories', category);
  }

  updateCategory(id: string, category: any): Observable<any> {
    return this.http.put(`http://localhost:5000/api/categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/api/categories/${id}`);
  }

  // Taxes
  getTaxes(): Observable<any> {
    return this.http.get('http://localhost:5000/api/taxes');
  }

  createTax(tax: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/taxes', tax);
  }

  updateTax(id: string, tax: any): Observable<any> {
    return this.http.put(`http://localhost:5000/api/taxes/${id}`, tax);
  }

  deleteTax(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/api/taxes/${id}`);
  }
}
