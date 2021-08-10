import { ProductoService } from "./producto.service";
import { SucursalService } from "./sucursal.service";
import { UsuarioService } from "./usuario.service";

export const SharedIntranetService = [
    SucursalService,
    UsuarioService,
    ProductoService
];