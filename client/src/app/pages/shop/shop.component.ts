import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, RouterLink],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  products: any[] = [];
  categories = ['All', 'Bags', 'Watches', 'Jewelry', 'Sunglasses', 'Belts'];
  selectedCategory = 'All';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.apiService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  filterCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.getAllProducts();
    } else {
      this.apiService.getProductsByCategory(category).subscribe(data => {
        this.products = data;
      });
    }
  }
}
