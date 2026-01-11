import { Injectable } from '@angular/core';
import { User, AuthError } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Supabase } from '../supabase/supabase';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private currentUser = new BehaviorSubject<User | null>(null); // Estado inicial
  public currentUser$: Observable<User | null> = this.currentUser.asObservable();

  constructor(private router: Router, private supabaseService: Supabase) {
    // A MÁGICA: Ouve o estado do login sem travar a aplicação
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      // Atualiza o BehaviorSubject. Quem estiver ouvindo (Header) vai saber na hora.
      this.currentUser.next(session?.user ?? null);
    });
  }

  async signInWithPassword(
    email: string,
    password: string
  ): Promise<{ user: User | null; error: AuthError | null }> {
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, error };
  }

  async signOut(): Promise<void> {
    await this.supabaseService.client.auth.signOut();
    this.router.navigate(['/']); // Mudei para raiz '/' ao invés de '/home'
  }

  // Método síncrono para verificar estado atual (útil para Guards)
  isLoggedIn(): boolean {
    return !!this.currentUser.value;
  }
}
