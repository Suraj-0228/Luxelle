import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './contact.component.html',
})
export class ContactComponent {
    isSubmitting = false;

    contact = {
        name: '',
        email: '',
        message: ''
    };

    onSubmit() {
        this.isSubmitting = true;
        // Mock submission
        setTimeout(() => {
            this.isSubmitting = false;
            Swal.fire({
                title: 'Sent!',
                text: 'Message sent successfully!',
                icon: 'success',
                confirmButtonColor: '#111827'
            });
            this.contact = { name: '', email: '', message: '' }; // Reset
        }, 1500);
    }
}
