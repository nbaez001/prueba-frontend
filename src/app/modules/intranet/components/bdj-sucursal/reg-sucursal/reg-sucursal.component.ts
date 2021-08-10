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
  selector: 'app-reg-sucursal',
  templateUrl: './reg-sucursal.component.html',
  styleUrls: ['./reg-sucursal.component.scss']
})
export class RegSucursalComponent implements OnInit {
  guardar: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegSucursalComponent>,
    private _snackBar: MatSnackBar,
    @Inject(SucursalService) private sucursalService: SucursalService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]]
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {

  }

  regSucursal(): void {
    if (this.formularioGrp.valid) {
      this.guardar = true;

      let req = new Sucursal();
      req.nombre = this.formularioGrp.get('nombre').value;

      console.log(req);
      this.sucursalService.registrarSucursal(req).subscribe(
        (out: OutResponse<Sucursal>) => {
          if (out.codigo == CONSTANTES.R_COD_EXITO) {

            this.dialogRef.close(out.objeto);
            this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
          } else {
            this._snackBar.open(out.mensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
          this.guardar = false;
        },
        error => {
          console.log(error);
          this.guardar = false;
          this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        }
      );
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }
}
