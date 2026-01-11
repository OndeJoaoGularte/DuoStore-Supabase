import { Component, OnDestroy, OnInit } from '@angular/core';
import { Catalog, Product, SortOption } from '../../services/catalog/catalog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ProductCard } from '../../components/product-card/product-card';
import { Auth } from '../../services/auth/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-feminina',
  imports: [CommonModule, FormsModule, ProductCard, RouterLink],
  templateUrl: './feminina.html',
  styleUrl: './feminina.scss',
})
export class Feminina implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = true;
  
  // Filtros
  searchTerm: string = '';
  currentSort: SortOption = 'new-desc';

  // Controle de Busca Ao Vivo (RxJS)
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private catalogService: Catalog,
    public authService: Auth // Public para usar no HTML
  ) {}

  ngOnInit(): void {
    // Configura o "Debounce": espera 300ms após parar de digitar para buscar
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.loadProducts();
    });

    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  // Chamado a cada tecla digitada no input
  onSearchInput(term: string): void {
    this.searchSubject.next(term);
  }

  async loadProducts() {
    this.loading = true;
    this.products = await this.catalogService.getProducts(
      'feminina', 
      this.searchTerm, 
      this.currentSort
    );
    this.loading = false;
  }
}