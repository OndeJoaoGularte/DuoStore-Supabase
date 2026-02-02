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
    orderBy: SortOption = 'new-desc',
    typeFilter: string = '' // <--- NOVO PARÂMETRO (Padrão vazio)
  ): Promise<Product[]> {
    
    // 1. Inicia a query filtrando pela categoria (Feminina ou Masculina)
    let query = this.supabase.client
      .from('products')
      .select('*')
      .eq('category', category);

    // 2. Filtro de busca (texto)
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`);
    }

    // 3. NOVO: Filtro por Tipo (Colar, Brinco, etc)
    // Só aplica se o filtro não estiver vazio
    if (typeFilter) {
      query = query.eq('type', typeFilter);
    }

    // 4. Ordenação
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

    // 5. Executa
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

  // Adicione dentro da classe CatalogService:

  // 1. Buscar tudo (sem filtro) para o admin
  async getAllProductsForAdmin() {
    const { data, error } = await this.supabase.client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  }

  // 2. Deletar produto
  async deleteProduct(id: number) {
    const { error } = await this.supabase.client.from('products').delete().eq('id', id);
    return { error };
  }

  // --- MÉTODOS DE ESCRITA (ADMIN) ---

  // 1. Criar novo produto
  async createProduct(product: Partial<Product>) {
    // Remove o ID se vier (o banco gera automático)
    const { id, ...data } = product;
    return await this.supabase.client.from('products').insert(data);
  }

  // 2. Atualizar produto existente
  async updateProduct(id: number, product: Partial<Product>) {
    return await this.supabase.client.from('products').update(product).eq('id', id);
  }

  // 3. Upload de Imagem (A parte mágica)
  async uploadImage(file: File): Promise<string | null> {
    try {
      // Gera um nome único: timestamp + extensão (ex: 123456789.png)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Faz o upload
      const { error: uploadError } = await this.supabase.client.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro upload:', uploadError);
        return null;
      }

      // Pega a URL pública para salvar no banco
      const { data } = this.supabase.client.storage.from('product-images').getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Erro geral upload:', error);
      return null;
    }
  }

  // Buscar produtos relacionados (mesma categoria, exeto o atual)
  async getRelatedProducts(productId: number, category: string, limit = 4): Promise<Product[]> {
    const { data, error } = await this.supabase.client
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', productId) // Não mostrar o próprio produto na lista
      .limit(limit);

    if (error) return [];
    return data as Product[];
  }
}
