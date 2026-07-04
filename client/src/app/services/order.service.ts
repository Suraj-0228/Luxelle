import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/orders`;

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

    cancelOrder(orderId: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${orderId}/cancel`, {});
    }
}
