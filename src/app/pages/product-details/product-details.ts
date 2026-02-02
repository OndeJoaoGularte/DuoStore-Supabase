import { Component, OnInit } from '@angular/core';
import { Catalog, Product } from '../../services/catalog/catalog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  whatsappNumber = '5551999934571'; // Seu número

  constructor(
    private route: ActivatedRoute,
    private catalogService: Catalog,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Escuta mudanças na URL (útil quando clica num produto relacionado)
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  async loadProduct(id: number) {
    this.loading = true;
    // Rola para o topo (caso o scroll restoration falhe ou seja navegação interna)
    window.scrollTo(0, 0);

    this.product = await this.catalogService.getProductById(id);

    if (this.product) {
      // Busca recomendados da mesma categoria
      this.relatedProducts = await this.catalogService.getRelatedProducts(
        this.product.id,
        this.product.category
      );
    }
    
    this.loading = false;
  }

  getWhatsappLink(): string {
    if (!this.product) return '';
    const message = `Olá! Gostei do *${this.product.name}*, produto que vi na DuoStore por R$ ${this.product.price}. Gostaria de saber como poderíamos prosseguir com a venda!`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  // Função para voltar para a listagem certa
  goBack() {
    if (this.product?.category === 'feminina') {
      this.router.navigate(['/feminina']);
    } else {
      this.router.navigate(['/campo-minado']);
    }
  }
}