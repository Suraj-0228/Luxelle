import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
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
            alert('Message sent successfully!');
            this.contact = { name: '', email: '', message: '' }; // Reset
        }, 1500);
    }
}
