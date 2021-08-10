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
  selector: 'app-reg-usuario',
  templateUrl: './reg-usuario.component.html',
  styleUrls: ['./reg-usuario.component.scss']
})
export class RegUsuarioComponent implements OnInit {
  guardar: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  listaSucursal: Sucursal[] = [];

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegUsuarioComponent>,
    private _snackBar: MatSnackBar,
    @Inject(UsuarioService) private usuarioService: UsuarioService,
    @Inject(SucursalService) private sucursalService: SucursalService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>) { }

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
  }

  listarSucursal(): void {
    this.sucursalService.listarSucursal().subscribe(
      (out: OutResponse<Sucursal[]>) => {
        if (out.codigo == CONSTANTES.R_COD_EXITO) {
          this.listaSucursal = out.objeto;
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

  regUsuario(): void {
    if (this.formularioGrp.valid) {
      this.guardar = true;

      let req = new Usuario();
      req.nombre = this.formularioGrp.get('nombre').value;
      req.user = this.formularioGrp.get('user').value;
      req.password = this.formularioGrp.get('password').value;
      let reqSucursal = new Sucursal();
      reqSucursal.codSucursal = this.formularioGrp.get('sucursal').value.codSucursal;
      reqSucursal.nombre = this.formularioGrp.get('sucursal').value.nombre;
      req.sucursal=reqSucursal;

      console.log(req);
      this.usuarioService.registrarUsuario(req).subscribe(
        (out: OutResponse<Usuario>) => {
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
