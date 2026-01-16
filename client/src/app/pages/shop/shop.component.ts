import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, RouterLink],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  products: any[] = [];
  categories = ['All', 'Bags', 'Watches', 'Sunglasses', 'Belts'];
  selectedCategory = 'All';
  itemsPerPage = 8;
  currentPage = 1;

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filterCategory(params['category']);
      } else {
        this.getAllProducts();
      }
    });
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  get pageNumbers() {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getAllProducts() {
    this.apiService.getProducts().subscribe(data => {
      // If a category is selected (from manual click), filter locally if API doesn't support it or if we just fetched all
      if (this.selectedCategory !== 'All') {
        this.products = data.filter(p => p.category === this.selectedCategory);
      } else {
        this.products = data;
      }
      this.currentPage = 1;
    });
  }

  filterCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
    if (category === 'All') {
      this.getAllProducts();
    } else {
      this.apiService.getProductsByCategory(category).subscribe(data => {
        this.products = data;
      });
    }
  }
}
