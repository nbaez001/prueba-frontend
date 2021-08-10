import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BdjProductoComponent } from './components/bdj-producto/bdj-producto.component';
import { BdjSucursalComponent } from './components/bdj-sucursal/bdj-sucursal.component';
import { BdjUsuarioComponent } from './components/bdj-usuario/bdj-usuario.component';

const intranetRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'sucursal',
        pathMatch: 'full'
      }, {
        path: 'sucursal',
        component: BdjSucursalComponent,
        data: { title: 'Sucursal' }
      }, {
        path: 'usuario',
        component: BdjUsuarioComponent,
        data: { title: 'Usuario' }
      }, {
        path: 'producto',
        component: BdjProductoComponent,
        data: { title: 'Producto' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(intranetRoutes)],
  exports: [RouterModule]
})
export class IntranetRoutingModule { }
