import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from '../../../entity/out-response';
import { Sucursal } from '../../../entity/sucursal.entity';
import { Usuario } from '../../../entity/usuario.entity';
import { DataDialog } from '../../../model/data-dialog.model';
import { SucursalService } from '../../../services/sucursal.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-mod-usuario',
  templateUrl: './mod-usuario.component.html',
  styleUrls: ['./mod-usuario.component.scss']
})
export class ModUsuarioComponent implements OnInit {
  modif: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  listaSucursal: Sucursal[] = [];

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModUsuarioComponent>,
    private _snackBar: MatSnackBar,
    @Inject(UsuarioService) private entidadService: UsuarioService,
    @Inject(SucursalService) private sucursalService: SucursalService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<Usuario>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      user: ['', [Validators.required, Validators.maxLength(250)]],
      password: ['', [Validators.required, Validators.maxLength(250)]],
      sucursal: ['', [Validators.required]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.listarSucursal();

    if (this.dataDialog.objeto) {
      this.formularioGrp.get('nombre').setValue(this.dataDialog.objeto.nombre);
      this.formularioGrp.get('user').setValue(this.dataDialog.objeto.user);
      this.formularioGrp.get('password').setValue(this.dataDialog.objeto.password);
    }
  }

  listarSucursal(): void {
    this.sucursalService.listarSucursal().subscribe(
      (out: OutResponse<Sucursal[]>) => {
        if (out.codigo == CONSTANTES.R_COD_EXITO) {
          this.listaSucursal = out.objeto;
          if (this.dataDialog.objeto) {
            let filSuc = this.listaSucursal.filter(el => (el.codSucursal == this.dataDialog.objeto.sucursal.codSucursal));
            this.formularioGrp.get('sucursal').setValue(filSuc[0]);
          }
        } else {
          this._snackBar.open(out.mensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          this.listaSucursal = [];
        }
      },
      error => {
        console.log(error);
        this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        this.listaSucursal = [];
      }
    );
  }

  modUsuario(): void {
    if (this.formularioGrp.valid) {
      this.modif = true;

      let req = new Usuario();
      req.codUsuario = this.dataDialog.objeto.codUsuario;
      req.nombre = this.formularioGrp.get('nombre').value;
      req.user = this.formularioGrp.get('user').value;
      req.password = this.formularioGrp.get('password').value;
      let reqSucursal = new Sucursal();
      reqSucursal.codSucursal = this.formularioGrp.get('sucursal').value.codSucursal;
      reqSucursal.nombre = this.formularioGrp.get('sucursal').value.nombre;
      req.sucursal = reqSucursal;

      console.log(req);
      this.entidadService.modificarUsuario(req).subscribe(
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
