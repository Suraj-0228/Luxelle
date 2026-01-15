import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './contact.component.html',
})
export class ContactComponent {
    isSubmitting = false;

    onSubmit() {
        this.isSubmitting = true;
        // Mock submission
        setTimeout(() => {
            this.isSubmitting = false;
            alert('Message sent successfully!');
        }, 1500);
    }
}
