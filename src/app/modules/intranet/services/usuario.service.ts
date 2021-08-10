import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../entity/out-response';
import { Usuario } from '../entity/usuario.entity';

@Injectable()
export class UsuarioService {

  constructor(private http: HttpClient) { }

  public listarUsuario(): Observable<OutResponse<Usuario[]>> {
    return this.http.post<OutResponse<Usuario[]>>(`${environment.backendUrl}/usuario/listar`, {});
  }

  public registrarUsuario(req: Usuario): Observable<OutResponse<Usuario>> {
    return this.http.post<OutResponse<Usuario>>(`${environment.backendUrl}/usuario/registrar`, req);
  }

  public modificarUsuario(req: Usuario): Observable<OutResponse<Usuario>> {
    return this.http.post<OutResponse<Usuario>>(`${environment.backendUrl}/usuario/modificar`, req);
  }

  public eliminarUsuario(req: Usuario): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.backendUrl}/usuario/eliminar`, req);
  }
}
