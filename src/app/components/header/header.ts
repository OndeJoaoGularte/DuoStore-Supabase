import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMenuOpen = false; // Menu mobile
  isScrolled = false; // Barra superior

  whatsappNumber = '5551999934571';

  constructor(public authService: Auth, private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // Função adaptada para o WhatsApp
  openWhatsApp(): void {
    this.isMenuOpen = false;
    const message = encodeURIComponent("Olá! Vim pelo site da DuoStore e gostaria de tirar uma dúvida...");
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
  }

  async onSignOut(): Promise<void> {
    await this.authService.signOut();
    this.router.navigate(['/']);
  }
}
