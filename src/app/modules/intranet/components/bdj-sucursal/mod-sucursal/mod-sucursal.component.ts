import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from '../../../entity/out-response';
import { Sucursal } from '../../../entity/sucursal.entity';
import { DataDialog } from '../../../model/data-dialog.model';
import { SucursalService } from '../../../services/sucursal.service';

@Component({
  selector: 'app-mod-sucursal',
  templateUrl: './mod-sucursal.component.html',
  styleUrls: ['./mod-sucursal.component.scss']
})
export class ModSucursalComponent implements OnInit {
  modif: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModSucursalComponent>,
    private _snackBar: MatSnackBar,
    @Inject(SucursalService) private entidadService: SucursalService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<Sucursal>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
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
    }
  }

  modSucursal(): void {
    if (this.formularioGrp.valid) {
      this.modif = true;

      let req = new Sucursal();
      req.codSucursal = this.dataDialog.objeto.codSucursal;
      req.nombre = this.formularioGrp.get('nombre').value;

      console.log(req);
      this.entidadService.modificarSucursal(req).subscribe(
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
