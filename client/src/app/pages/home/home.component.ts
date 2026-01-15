import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];

  valueProps = [
    {
      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
      title: 'Free Worldwide Shipping',
      description: 'On all orders over $150'
    },
    {
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      title: 'Premium Quality',
      description: 'Handcrafted with excellence'
    },
    {
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      title: 'Secure Payments',
      description: '100% protected transactions'
    }
  ];

  categories = [
    {
      title: 'Luxury Bags',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=60',
      link: '/shop',
      size: 'large'
    },
    {
      title: 'Timeless Watches',
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&auto=format&fit=crop&q=60',
      link: '/shop',
      size: 'small'
    },
    {
      title: 'Elegant Jewelry',
      image: 'https://images.unsplash.com/photo-1599643477877-5313557d80fe?w=600&auto=format&fit=crop&q=60',
      link: '/shop',
      size: 'small'
    }
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getProducts().subscribe(data => {
      // Just take first 4 as featured
      this.featuredProducts = data.slice(0, 4);
    });
  }
}
