import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [RouterOutlet, AdminSidebarComponent],
    template: `
    <div class="flex min-h-screen bg-gray-100">
      <app-admin-sidebar></app-admin-sidebar>
      <div class="flex-1 ml-64 p-8">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AdminLayoutComponent { }
