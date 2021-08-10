import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONSTANTES, MENSAJES, MENSAJES_PANEL } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from '../../entity/out-response';
import { Usuario } from '../../entity/usuario.entity';
import { UsuarioService } from '../../services/usuario.service';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { ModUsuarioComponent } from './mod-usuario/mod-usuario.component';
import { RegUsuarioComponent } from './reg-usuario/reg-usuario.component';

@Component({
  selector: 'app-bdj-usuario',
  templateUrl: './bdj-usuario.component.html',
  styleUrls: ['./bdj-usuario.component.scss']
})
export class BdjUsuarioComponent implements OnInit {
  exportar = false;

  activoLista: any;
  listaUsuario: Usuario[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<Usuario>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: Usuario) => (m.nombre != null) ? `${m.nombre}` : ''
    },
    {
      columnDef: 'user',
      header: 'Usuario',
      cell: (m: Usuario) => (m.user != null) ? `${m.user}` : ''
    },
    {
      columnDef: 'password',
      header: 'Password',
      cell: (m: Usuario) => (m.password != null) ? `${m.password}` : ''
    },
    {
      columnDef: 'sucNombre',
      header: 'Sucursal',
      cell: (m: Usuario) => (m.sucursal.nombre != null) ? `${m.sucursal.nombre}` : ''
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private usuarioService: UsuarioService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.maxLength(250)]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.definirTabla();
    this.buscar();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
    this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    if (this.listaUsuario.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaUsuario);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  buscar(): void {
    this.dataSource = null;
    this.isLoading = true;

    this.usuarioService.listarUsuario().subscribe(
      (data: OutResponse<Usuario[]>) => {
        console.log(data);
        if (data.codigo == CONSTANTES.R_COD_EXITO) {
          this.listaUsuario = data.objeto;
        } else {
          this.listaUsuario = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      },
      error => {
        console.log(error);
        this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        this.isLoading = false;
      }
    );
  }

  regUsuario() {
    const dialogRef = this.dialog.open(RegUsuarioComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.USUARIO.MODIFICAR.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaUsuario.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  editUsuario(obj: Usuario) {
    let index = this.listaUsuario.indexOf(obj);
    const dialogRef = this.dialog.open(ModUsuarioComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.USUARIO.MODIFICAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaUsuario.splice(index, 1, result);
        this.cargarDatosTabla();
      }
    });
  }

  elimUsuario(obj: Usuario): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {
        titulo: MENSAJES.MSG_CONFIRMACION_DELETE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == CONSTANTES.COD_CONFIRMADO) {
        this.spinner.show();
        let index = this.listaUsuario.indexOf(obj);

        this.usuarioService.eliminarUsuario(obj).subscribe(
          (data: OutResponse<any>) => {
            if (data.codigo == CONSTANTES.R_COD_EXITO) {
              this.listaUsuario.splice(index, 1);
              this.cargarDatosTabla();
              this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
            } else {
              this._snackBar.open(data.mensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
            }
            this.spinner.hide();
          }, error => {
            console.error(error);
            this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
            this.spinner.hide();
          }
        )
      }
    });
  }

  limpiar(): void {
    this.formService.setAsUntoched(this.formularioGrp, this.formErrors);
    this.formularioGrp.get('flgActivo').setValue(this.activoLista[1]);
  }

}
