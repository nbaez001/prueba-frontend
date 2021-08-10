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
import { Sucursal } from '../../entity/sucursal.entity';
import { SucursalService } from '../../services/sucursal.service';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { ModSucursalComponent } from './mod-sucursal/mod-sucursal.component';
import { RegSucursalComponent } from './reg-sucursal/reg-sucursal.component';

@Component({
  selector: 'app-bdj-sucursal',
  templateUrl: './bdj-sucursal.component.html',
  styleUrls: ['./bdj-sucursal.component.scss']
})
export class BdjSucursalComponent implements OnInit {
  exportar = false;

  activoLista: any;
  listaSucursal: Sucursal[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<Sucursal>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: Sucursal) => (m.nombre != null) ? `${m.nombre}` : ''
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(SucursalService) private sucursalService: SucursalService,
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
    if (this.listaSucursal.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaSucursal);
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

    this.sucursalService.listarSucursal().subscribe(
      (data: OutResponse<Sucursal[]>) => {
        console.log(data);
        if (data.codigo == CONSTANTES.R_COD_EXITO) {
          this.listaSucursal = data.objeto;
        } else {
          this.listaSucursal = [];
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

  regSucursal() {
    const dialogRef = this.dialog.open(RegSucursalComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.SUCURSAL.MODIFICAR.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaSucursal.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  editSucursal(obj: Sucursal) {
    let index = this.listaSucursal.indexOf(obj);
    const dialogRef = this.dialog.open(ModSucursalComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.SUCURSAL.MODIFICAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaSucursal.splice(index, 1, result);
        this.cargarDatosTabla();
      }
    });
  }

  elimSucursal(obj: Sucursal): void {
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
        let index = this.listaSucursal.indexOf(obj);

        this.sucursalService.eliminarSucursal(obj).subscribe(
          (data: OutResponse<any>) => {
            if (data.codigo == CONSTANTES.R_COD_EXITO) {
              this.listaSucursal.splice(index, 1);
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
