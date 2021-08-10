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
import { Producto } from '../../entity/producto.entity';
import { ProductoService } from '../../services/producto.service';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { ModProductoComponent } from './mod-producto/mod-producto.component';
import { RegProductoComponent } from './reg-producto/reg-producto.component';

@Component({
  selector: 'app-bdj-producto',
  templateUrl: './bdj-producto.component.html',
  styleUrls: ['./bdj-producto.component.scss']
})
export class BdjProductoComponent implements OnInit {
  exportar = false;

  activoLista: any;
  listaProducto: Producto[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<Producto>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: Producto) => (m.nombre != null) ? `${m.nombre}` : ''
    },
    {
      columnDef: 'precio',
      header: 'Precio',
      cell: (m: Producto) => (m.precio != null) ? `${m.precio}` : ''
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(ProductoService) private productoService: ProductoService,
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
    if (this.listaProducto.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaProducto);
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

    this.productoService.listarProducto().subscribe(
      (data: OutResponse<Producto[]>) => {
        console.log(data);
        if (data.codigo == CONSTANTES.R_COD_EXITO) {
          this.listaProducto = data.objeto;
        } else {
          this.listaProducto = [];
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

  regProducto() {
    const dialogRef = this.dialog.open(RegProductoComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.PRODUCTO.MODIFICAR.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaProducto.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  editProducto(obj: Producto) {
    let index = this.listaProducto.indexOf(obj);
    const dialogRef = this.dialog.open(ModProductoComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.PRODUCTO.MODIFICAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaProducto.splice(index, 1, result);
        this.cargarDatosTabla();
      }
    });
  }

  elimProducto(obj: Producto): void {
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
        let index = this.listaProducto.indexOf(obj);

        this.productoService.eliminarProducto(obj).subscribe(
          (data: OutResponse<any>) => {
            if (data.codigo == CONSTANTES.R_COD_EXITO) {
              this.listaProducto.splice(index, 1);
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
