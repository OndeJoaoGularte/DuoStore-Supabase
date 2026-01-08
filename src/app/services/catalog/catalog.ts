import { Injectable } from '@angular/core';
import { Supabase } from '../supabase/supabase';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'feminina' | 'masculina';
  type: string;
  created_at?: string;
}

// Tipos de ordenação permitidos
export type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'new-asc'
  | 'new-desc';

@Injectable({
  providedIn: 'root',
})
export class Catalog {
  constructor(private supabase: Supabase) {}

  async getProducts(
    category: 'feminina' | 'masculina',
    searchTerm: string = '',
    orderBy: SortOption = 'new-desc' // Padrão agora é "novidade"
  ): Promise<Product[]> {
    // 1. Inicia a query
    let query = this.supabase.client.from('products').select('*').eq('category', category);

    // 2. Filtro de busca (se houver texto)
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`);
    }

    // 3. Ordenação (Lógica Refatorada)
    let column = 'created_at';
    let ascending = false;

    switch (orderBy) {
      case 'price-asc':
        column = 'price';
        ascending = true;
        break;
      case 'price-desc':
        column = 'price';
        ascending = false;
        break;
      case 'name-asc':
        column = 'name';
        ascending = true;
        break;
      case 'name-desc':
        column = 'name';
        ascending = false;
        break;
      case 'new-asc':
        column = 'created_at';
        ascending = true;
        break;
      case 'new-desc':
        column = 'created_at';
        ascending = false;
        break;
    }

    query = query.order(column, { ascending });

    // 4. Executa
    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar catálogo:', error);
      return [];
    }

    return data as Product[];
  }

  // Busca produto único
  async getProductById(id: number) {
    const { data, error } = await this.supabase.client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
    return data as Product;
  }
}
