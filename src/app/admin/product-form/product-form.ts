import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Catalog } from '../../services/catalog/catalog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  productForm: FormGroup;
  loading = false;
  isEditMode = false;
  productId: number | null = null;

  // Controle de Imagem
  selectedFile: File | null = null;
  imagePreview: string | null = null; // Para mostrar na tela antes de salvar

  constructor(
    private fb: FormBuilder,
    private catalogService: Catalog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Configuração do Formulário
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: [''],
      category: ['feminina', Validators.required], // Valor padrão
      type: ['colar', Validators.required], // Valor padrão
    });
  }

  ngOnInit(): void {
    // Verifica se tem ID na URL (Modo Edição)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProductData(this.productId);
    }
  }

  async loadProductData(id: number) {
    this.loading = true;
    const product = await this.catalogService.getProductById(id);

    if (product) {
      // Preenche o formulário com os dados do banco
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        type: product.type,
      });
      // Mostra a imagem atual
      this.imagePreview = product.image_url;
    }
    this.loading = false;
  }

  // Chamado quando o usuário escolhe uma foto
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Cria um preview local para o usuário ver o que escolheu
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.productForm.invalid) return;

    this.loading = true;
    const formValue = this.productForm.value;

    try {
      let imageUrl = this.imagePreview; // Mantém a atual se não mudar

      // 1. Se tiver arquivo novo, faz upload primeiro
      if (this.selectedFile) {
        const url = await this.catalogService.uploadImage(this.selectedFile);
        if (url) imageUrl = url;
      }

      // 2. Monta o objeto final
      const productData = {
        ...formValue,
        image_url: imageUrl,
      };

      // 3. Salva no banco (Create ou Update)
      if (this.isEditMode && this.productId) {
        await this.catalogService.updateProduct(this.productId, productData);
      } else {
        await this.catalogService.createProduct(productData);
      }

      // 4. Sucesso! Volta pra lista
      this.router.navigate(['/admin']);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar produto.');
    } finally {
      this.loading = false;
    }
  }
}
