import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../entity/out-response';
import { Producto } from '../entity/producto.entity';

@Injectable()
export class ProductoService {

  constructor(private http: HttpClient) { }

  public listarProducto(): Observable<OutResponse<Producto[]>> {
    return this.http.post<OutResponse<Producto[]>>(`${environment.backendUrl}/producto/listar`, {});
  }

  public registrarProducto(req: Producto): Observable<OutResponse<Producto>> {
    return this.http.post<OutResponse<Producto>>(`${environment.backendUrl}/producto/registrar`, req);
  }

  public modificarProducto(req: Producto): Observable<OutResponse<Producto>> {
    return this.http.post<OutResponse<Producto>>(`${environment.backendUrl}/producto/modificar`, req);
  }

  public eliminarProducto(req: Producto): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.backendUrl}/producto/eliminar`, req);
  }
}
