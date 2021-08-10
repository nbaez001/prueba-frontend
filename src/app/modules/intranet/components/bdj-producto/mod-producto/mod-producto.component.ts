import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from '../../../entity/out-response';
import { Producto } from '../../../entity/producto.entity';
import { DataDialog } from '../../../model/data-dialog.model';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-mod-producto',
  templateUrl: './mod-producto.component.html',
  styleUrls: ['./mod-producto.component.scss']
})
export class ModProductoComponent implements OnInit {
  modif: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModProductoComponent>,
    private _snackBar: MatSnackBar,
    @Inject(ProductoService) private entidadService: ProductoService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<Producto>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      precio: ['', [Validators.required, Validators.min(1)]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    if (this.dataDialog.objeto) {
      this.formularioGrp.get('nombre').setValue(this.dataDialog.objeto.nombre);
      this.formularioGrp.get('precio').setValue(this.dataDialog.objeto.precio);
    }
  }

  modProducto(): void {
    if (this.formularioGrp.valid) {
      this.modif = true;

      let req = new Producto();
      req.codProducto = this.dataDialog.objeto.codProducto;
      req.nombre = this.formularioGrp.get('nombre').value;
      req.precio = this.formularioGrp.get('precio').value;

      console.log(req);
      this.entidadService.modificarProducto(req).subscribe(
        (out: OutResponse<any>) => {
          if (out.codigo == CONSTANTES.R_COD_EXITO) {

            this.dialogRef.close(out.objeto);
            this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
          } else {
            this._snackBar.open(out.mensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
          this.modif = false;
        },
        error => {
          console.log(error);
          this.modif = false;
          this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        }
      );
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }
}
