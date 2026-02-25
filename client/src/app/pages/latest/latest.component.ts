import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-latest',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './latest.component.html',
  styleUrl: './latest.component.css',
})
export class LatestComponent implements OnInit {
  products: any[] = [];


  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getLatestProducts();
  }

  getLatestProducts() {
    this.apiService.getProducts().subscribe(data => {
      // Sort by newest based on createdAt or fallback to _id timestamp parsing
      this.products = data.sort((a: any, b: any) => {
        return new Date(b.createdAt || b._id).getTime() - new Date(a.createdAt || a._id).getTime();
      }).slice(0, 4);
    });
  }

  get paginatedProducts() {
    return this.products;
  }
}
