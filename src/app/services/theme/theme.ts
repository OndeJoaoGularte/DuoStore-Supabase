import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Theme {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Inicia o observador assim que o serviço é criado
    this.initThemeObserver();
  }

  private initThemeObserver() {
    // Verifica se estamos no navegador (para evitar erro no servidor se usar SSR no futuro)
    if (!isPlatformBrowser(this.platformId)) return;

    this.router.events.pipe(
      // Filtra apenas eventos de "Navegação Concluída"
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateTheme(event.url);
    });
  }

  private updateTheme(url: string) {
    const body = document.body;

    // Reseta atributos primeiro
    body.removeAttribute('data-theme');

    // Lógica de decisão
    if (url.includes('/feminina')) {
      body.setAttribute('data-theme', 'feminina');
    } 
    else if (url.includes('/campo-minado') || url.includes('/masculina')) {
      body.setAttribute('data-theme', 'masculina');
    }
    // Se não for nenhum (ex: Home, Admin), fica sem atributo (usa o :root padrão azul)
  }
}