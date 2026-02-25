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
  allProducts: any[] = []; // Store all fetched products
  categories = ['All', 'Bags', 'Watches', 'Sunglasses', 'Belts'];
  selectedCategory = 'All';
  searchQuery = '';
  selectedPriceRange = 'All';
  selectedSort = 'default';

  priceRanges = [
    { label: 'All Prices', value: 'All' },
    { label: 'Under $100', min: 0, max: 100, value: '0-100' },
    { label: '$100 - $300', min: 100, max: 300, value: '100-300' },
    { label: '$300 - $500', min: 300, max: 500, value: '300-500' },
    { label: 'Over $500', min: 500, max: Infinity, value: '500-inf' }
  ];

  itemsPerPage = 8;
  currentPage = 1;

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // Logic could be enhanced here to parse params for search/price too
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['sort']) {
        this.selectedSort = params['sort'];
      }
      this.getAllProducts();
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
      this.allProducts = data;
      this.applyFilters();
    });
  }

  // Unified filter function
  applyFilters() {
    let filtered = [...this.allProducts];

    // 1. Category Filter
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // 2. Search Filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    // 3. Price Filter
    if (this.selectedPriceRange !== 'All') {
      const range = this.priceRanges.find(r => r.value === this.selectedPriceRange);
      if (range) {
        filtered = filtered.filter(p => {
          const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
          // @ts-ignore
          return price >= range.min && price <= range.max;
        });
      }
    }

    // 4. Sort Filter
    if (this.selectedSort === 'newest') {
      filtered = filtered.sort((a, b) => {
        return new Date(b.createdAt || b._id).getTime() - new Date(a.createdAt || a._id).getTime();
      });
    }

    this.products = filtered;
    this.currentPage = 1; // Reset to first page on filter change
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onPriceChange(rangeValue: string) {
    this.selectedPriceRange = rangeValue;
    this.applyFilters();
  }
}
