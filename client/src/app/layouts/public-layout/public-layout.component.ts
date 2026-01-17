import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
    selector: 'app-public-layout',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, FooterComponent],
    template: `
    <app-navbar></app-navbar>
    <main class="min-h-screen pt-20 px-4 md:px-8 bg-gray-50">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `
})
export class PublicLayoutComponent { }
