import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../entity/out-response';
import { Sucursal } from '../entity/sucursal.entity';

@Injectable()
export class SucursalService {
  constructor(private http: HttpClient) { }

  public listarSucursal(): Observable<OutResponse<Sucursal[]>> {
    return this.http.post<OutResponse<Sucursal[]>>(`${environment.backendUrl}/sucursal/listar`, {});
  }

  public registrarSucursal(req: Sucursal): Observable<OutResponse<Sucursal>> {
    return this.http.post<OutResponse<Sucursal>>(`${environment.backendUrl}/sucursal/registrar`, req);
  }

  public modificarSucursal(req: Sucursal): Observable<OutResponse<Sucursal>> {
    return this.http.post<OutResponse<Sucursal>>(`${environment.backendUrl}/sucursal/modificar`, req);
  }

  public eliminarSucursal(req: Sucursal): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.backendUrl}/sucursal/eliminar`, req);
  }
}
