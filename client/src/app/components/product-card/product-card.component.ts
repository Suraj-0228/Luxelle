import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product: any;

  constructor(private cartService: CartService) { }

  addToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(this.product);
  }
}
