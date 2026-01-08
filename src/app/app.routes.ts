import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Feminina } from './pages/feminina/feminina';
import { Masculina } from './pages/masculina/masculina';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { QuemSomos } from './pages/quem-somos/quem-somos';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'feminina', component: Feminina }, // Loja Principal
  { path: 'campo-minado', component: Masculina },
  { path: 'quem-somos', component: QuemSomos },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin }, // Vamos proteger isso depois
  { path: '**', redirectTo: '' }, // Qualquer rota errada volta pra home
];
