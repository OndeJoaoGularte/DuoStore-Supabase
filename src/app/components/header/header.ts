import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isMenuOpen = false; // Menu mobile
  isScrolled = false; // Barra superior

  // Variáveis para controlar o Texto e o Estilo do Logo
  logoText: string = 'DuoStore';
  currentTheme: string = 'default'; // 'default', 'feminina', 'masculina'

  whatsappNumber = '5551999934571';

  constructor(
    public authService: Auth,
    private router: Router,
  ) {}

  ngOnInit() {
    // Escuta as mudanças de rota para trocar o texto do logo
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateHeaderIdentity(event.url);
      });
  }

  updateHeaderIdentity(url: string) {
    if (url.includes('/feminina')) {
      this.logoText = 'Feminina';
      this.currentTheme = 'feminina';
    } else if (url.includes('/campo-minado')) {
      this.logoText = 'Campo Minado';
      this.currentTheme = 'masculina';
    } else {
      // Se estiver na Home, Admin ou Login
      this.logoText = 'DuoStore';
      this.currentTheme = 'default';
    }
  }

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
    const message = encodeURIComponent(
      'Olá! Vim pelo site da DuoStore e gostaria de tirar uma dúvida...',
    );
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
  }

  async onSignOut(): Promise<void> {
    await this.authService.signOut();
    this.router.navigate(['/']);
  }
}
