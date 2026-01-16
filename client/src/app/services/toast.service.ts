import { Injectable, signal } from '@angular/core';

export interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
    id: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    toasts = signal<Toast[]>([]);
    private counter = 0;

    show(message: string, type: 'success' | 'error' | 'info' = 'success') {
        const id = this.counter++;
        this.toasts.update(current => [...current, { message, type, id }]);

        setTimeout(() => {
            this.remove(id);
        }, 3000); // Auto dismiss after 3 seconds
    }

    remove(id: number) {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }
}
