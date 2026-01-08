import { Component, Input } from '@angular/core';
import { Product } from '../../services/catalog/catalog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input() product!: Product;

  // Número do WhatsApp da Loja
  private whatsappNumber = '5551999934571'; 

  get whatsappLink(): string {
    const message = `Olá! Gostei do *${this.product.name}*, produto que vi na DuoStore por R$ ${this.product.price}. Gostaria de saber como poderíamos prosseguir com a venda!`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
    }
}