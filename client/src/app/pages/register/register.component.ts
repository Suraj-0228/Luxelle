import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm = this.fb.group({
        fullname: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    errorMsg = '';

    onSubmit() {
        if (this.registerForm.valid) {
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.errorMsg = err.error.message || 'Registration failed';
                }
            });
        }
    }
}
