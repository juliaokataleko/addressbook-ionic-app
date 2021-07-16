import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'address/add',
    loadChildren: () => import('./address-form/address-form.module').then(m => m.AddressFormPageModule)
  },
  {
    path: 'address/show/:id',
    loadChildren: () => import('./address-form/address-form.module').then(m => m.AddressFormPageModule)
  },
  {
    path: 'address/edit/:id',
    loadChildren: () => import('./address-form/address-form.module').then(m => m.AddressFormPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
