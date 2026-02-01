import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  public currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  whatsappNumber = '5551999934571';

  openWhatsApp(): void {
    const message = encodeURIComponent(
      'Olá! Vim pelo site da DuoStore e gostaria de tirar uma dúvida...',
    );
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
  }
}
