import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api/orders';

    createOrder(orderData: any): Observable<any> {
        return this.http.post(this.apiUrl, orderData);
    }

    getOrders(userId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/user/${userId}`);
    }

    getAllOrders(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    updateOrderStatus(orderId: string, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${orderId}/status`, { orderStatus: status });
    }
}
