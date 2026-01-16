import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './order-success.component.html'
})
export class OrderSuccessComponent {
  Math = Math;
}
