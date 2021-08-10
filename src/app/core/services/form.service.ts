import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  getValidationErrors(group: FormGroup, formErrors: any, type: boolean): void {
    Object.keys(group.controls).forEach((key: string) => {
      let abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.getValidationErrors(abstractControl, formErrors[key], type);
      } else {
        if (type) {
          abstractControl.markAsTouched();
        }
        formErrors[key] = '';
        if (abstractControl && abstractControl.invalid && (abstractControl.touched || abstractControl.dirty)) {
          for (let errorKey in abstractControl.errors) {
            if (errorKey) {
              formErrors[key] += this.choseMessage(errorKey, abstractControl) + '/';
            }
          }

          if (formErrors[key].length > 0) {
            formErrors[key] = formErrors[key].substr(0, formErrors[key].length - 1);
          }
        }
      }
    });
  }

  setAsUntoched(group: FormGroup, formErrors: any, exclusions?: string[]): void {
    group.markAsUntouched();
    Object.keys(group.controls).forEach((key: string) => {
      let abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.setAsUntoched(abstractControl, formErrors[key]);
      } else {
        if (typeof exclusions != 'undefined') {
          let ex = exclusions.find(el => el == key);
          if (!ex) {
            abstractControl.setValue('');
            abstractControl.markAsUntouched();
          }
        } else {
          abstractControl.setValue('');
          abstractControl.markAsUntouched();
        }
        formErrors[key] = '';
      }
    });
  }

  disableControls(group: FormGroup, exclusions?: [string]): void {
    Object.keys(group.controls).forEach((key: string) => {
      let abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.disableControls(abstractControl, exclusions);
      } else {
        if (typeof exclusions != 'undefined') {
          let ex = exclusions.find(el => el == key);
          if (!ex) {
            abstractControl.disable()
          }
        } else {
          abstractControl.disable();
        }
      }
    });
  }

  removeErrors(group: FormGroup, exclusions?: [string]): void {
    Object.keys(group.controls).forEach((key: string) => {
      let abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.removeErrors(abstractControl, exclusions);
      } else {
        if (typeof exclusions != 'undefined') {
          let ex = exclusions.find(el => el == key);
          if (!ex) {
            abstractControl.setErrors(null)
          }
        } else {
          abstractControl.setErrors(null);
        }
      }
    });
  }

  buildFormErrors(group: FormGroup, formErrors: any): any {
    formErrors = {};
    Object.keys(group.controls).forEach((key: string) => {
      let abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.buildFormErrors(abstractControl, formErrors[key]);
      } else {
        formErrors[key] = '';
      }
    });
    return formErrors;
  }

  choseMessage(error: string, control: any): string {
    let errorCtrl = control['errors'];
    let msg = '';
    switch (error) {
      case 'required':
        msg = 'Campo obligatorio';
        break;
      case 'minlength':
        msg = `Minimo ${errorCtrl['minlength']['requiredLength']} caracteres`;
        break;
      case 'maxlength':
        msg = `Maximo ${errorCtrl['maxlength']['requiredLength']} caracteres`;
        break;
      case 'min':
        msg = `Minimo valor permitido es ${errorCtrl['min']['min']}`;
        break;
      case 'max':
        msg = `Maximo valor permitido es ${errorCtrl['max']['max']}`;
        break;
      case 'pattern':
        msg = `El valor debe tener el patron ${errorCtrl['pattern']['requiredPattern']}`;
        break;
      case 'onlyNumbers':
        msg = `Ingrese solo numeros`;
        break;
      case 'notCaracterNumeral':
        msg = `Caracter # no permitido`;
        break;
      case 'notCaracterOR':
        msg = `Caracter | no permitido`;
        break;
      case 'onlyAlfanumericoYSubguion':
        msg = `Ingrese solo alfanumericos y subguion`;
        break;
      case 'confirmPassword':
        msg = 'Las contraseñas no coinciden';
        break;
      case 'validUsername':
        msg = 'Usuario ya existe';
        break;
      case 'onlyNumberPuntoSigno':
        msg = 'Formato numerico invalido';
        break;
      case 'patronYAlfanumerico':
        msg = `El codigo debe tener el patron: ${errorCtrl['patronYAlfanumerico']['patron']}`;
        break;
      default:
        msg = 'Valor incorrecto';
        console.log('Mensaje no encontrado');
        console.log(error);
        console.log(errorCtrl);
        break;
    }
    return msg;
  }
}
