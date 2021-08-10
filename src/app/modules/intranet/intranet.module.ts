import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { IntranetRoutingModule } from './intranet-routing.module';
import { MaterialModule } from '../material.module';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BdjSucursalComponent } from './components/bdj-sucursal/bdj-sucursal.component';
import { RegSucursalComponent } from './components/bdj-sucursal/reg-sucursal/reg-sucursal.component';
import { ModSucursalComponent } from './components/bdj-sucursal/mod-sucursal/mod-sucursal.component';
import { SharedIntranetService } from './services/shared-intranet.service';
import { ConfirmComponent } from './components/shared/confirm/confirm.component';
import { SharedModule } from '../shared.module';
import { BdjUsuarioComponent } from './components/bdj-usuario/bdj-usuario.component';
import { RegUsuarioComponent } from './components/bdj-usuario/reg-usuario/reg-usuario.component';
import { ModUsuarioComponent } from './components/bdj-usuario/mod-usuario/mod-usuario.component';
import { BdjProductoComponent } from './components/bdj-producto/bdj-producto.component';
import { RegProductoComponent } from './components/bdj-producto/reg-producto/reg-producto.component';
import { ModProductoComponent } from './components/bdj-producto/mod-producto/mod-producto.component';


@NgModule({
  entryComponents: [
    RegSucursalComponent,
    ModSucursalComponent,
    ConfirmComponent,
  ],
  declarations: [
    RegSucursalComponent,
    ModSucursalComponent,
    ConfirmComponent,

    NavbarComponent,
    BdjSucursalComponent,
    BdjUsuarioComponent,
    RegUsuarioComponent,
    ModUsuarioComponent,
    BdjProductoComponent,
    RegProductoComponent,
    ModProductoComponent,
  ],
  imports: [
    CommonModule,
    IntranetRoutingModule,
    MaterialModule,
    SharedModule
  ],
  providers: [
    ...SharedIntranetService,
    DatePipe
  ]
})
export class IntranetModule { }
