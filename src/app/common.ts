export const MENSAJES_PANEL = {
    INTRANET: {
        SUCURSAL: {
            REGISTRAR: {
                TITLE: 'REGISTRAR SUCURSAL'
            },
            MODIFICAR: {
                TITLE: 'MODIFICAR SUCURSAL'
            }
        },
        USUARIO: {
            REGISTRAR: {
                TITLE: 'REGISTRAR USUARIO'
            },
            MODIFICAR: {
                TITLE: 'MODIFICAR USUARIO'
            }
        },
        PRODUCTO: {
            REGISTRAR: {
                TITLE: 'REGISTRAR PRODUCTO'
            },
            MODIFICAR: {
                TITLE: 'MODIFICAR PRODUCTO'
            }
        }
    }
};

export const MENSAJES = {
    ERROR_FOREIGN_KEY: 'No se eliminar una categoria que tiene sub items',
    EXITO_OPERACION: 'Operacion exitosa',
    MSG_EXITO_OPERACION: 'Operacion exitosa',
    MSG_CONFIRMACION: '¿Esta seguro de continuar?',
    MSG_CONFIRMACION_DELETE: '¿Esta seguro que desea eliminar el registro seleccionado?',
    MSG_CONFIRMACION_AGREGAR_CAMPO_BD: '¿Esta seguro que desea agregar una nueva columna a la base de datos?',
    MSG_CONFIRMACION_AGREGAR_CAMPO_BD_DETALLE: 'Despues de agregarla no es posible eliminarla, sino con una solicitud al administrador de base de datos - DBA',
    MSG_CONFIRM_REPLICAR_ESTRUCTURA: '¿Esta seguro que desea replicar el mapeo de campos de la estructura seleccionada?',
    MSG_CONFIRM_REPLICAR_ESTRUCTURA_DETALLE: 'Se eliminaran todos los mapeos de campos previos registrados',
    MSG_ERROR_IMPORTACION: 'Lista de errores e importacion',
    MSG_CONFIRM_FUNC_VACIO: '¿Esta seguro de guardar este perfil?',
    MSG_CONFIRM_FUNC_VACIO_DETALLE: 'No se ha seleccionado ninguna funcionalidad diferente a "Home"'
};

export const CONSTANTES = {
    FLG_ACTIVO: 1,
    FLG_INACTIVO: 0,
    R_COD_EXITO: 0,

    PERFIL_OMEP: 'OMEP',

    COD_CONFIRMADO: 1,
    COD_NO_CONFIRMADO: 0,
};