import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Catalog, Product } from '../../services/catalog/catalog';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(private catalogService: Catalog) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  async loadAllProducts() {
    this.loading = true;
    // Aqui precisamos de um método no service que traga TUDO.
    // Vou assumir que você vai usar o getProducts, mas idealmente
    // teríamos um getAllProducts sem filtro de categoria.
    // Por enquanto, vamos buscar as duas categorias e juntar, ou ajustar o service.

    // Solução rápida: Buscar produtos sem filtro (ajustaremos o service abaixo*)
    const { data } = await this.catalogService.getAllProductsForAdmin();
    this.products = data || [];
    this.loading = false;
  }

  async deleteProduct(id: number) {
    if (confirm('Tem certeza que deseja apagar este produto? Essa ação não tem volta.')) {
      await this.catalogService.deleteProduct(id);
      // Recarrega a lista
      this.loadAllProducts();
    }
  }
}
