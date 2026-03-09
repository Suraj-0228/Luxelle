import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    showPassword = signal(false);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email, this.gmailValidator]],
        password: ['', Validators.required]
    });

    errorMsg = '';

    togglePasswordValue() {
        this.showPassword.update(value => !value);
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: (res) => {
                    Swal.fire({
                        title: 'Welcome Back!',
                        text: `Login Successful. Welcome to Luxelle, ${res.username}!`,
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        backdrop: `rgba(0,0,0,0.6)`
                    });

                    if (this.authService.isAdmin()) {
                        this.router.navigate(['/admin/products']);
                    } else {
                        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                        this.router.navigateByUrl(returnUrl);
                    }
                },
                error: (err) => {
                    const msg = err.error.message || 'Login Failed';
                    this.errorMsg = msg;
                    this.toastService.show(msg, 'error');
                }
            });
        }
    }

    gmailValidator(control: AbstractControl): ValidationErrors | null {
        const email = control.value;
        if (!email) return null;
        if (email === 'admin@example.com' || email === 'admin@luxelle.com') return null;
        const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
        if (emailRegex.test(email)) {
            return null;
        }
        return { gmailInvalid: true };
    }
}
