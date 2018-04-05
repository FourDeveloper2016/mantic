package mx.org.kaana.kajool.enums;

/**
 *@company KAANA
 *@project KAJOOL (Control system polls)
 *@date 16/04/2014
 *@time 02:08:55 PM
 *@author Team Developer 2016 <team.developer@kaana.org.mx>
 */
public enum EExcepciones {

	GENERAR_NOMBRE_ARCHIVO_ERROR,
	ARCHIVO_EN_OTRO_ESTATUS,
	ERROR_EN_TIPO_SOLICITUD,
	NO_EXISTE_ARCHIVO_EN_FTP,
	SIN_INFO_ARCHIVO_CLAVE_OPER,
	NO_EXISTE_ARCHIVO_EN_BD,
	ERROR_EN_ACTUALIZACION,
	SIN_INFO_CLAVE_OPER,
	SIN_EXPRESION_QUARTZ,
	FECHA_MENOR_A_ACTUAL,
	SIN_VERSION_DISPONIBLE,
	MISMA_VERSION,
	DOS_VERSIONES_IGUALES,
	EXISTE_PUBLICACION_AGENDADA,
	EXISTEN_VERSIONES_ACTUALES,
	NOMBRE_ARCHIVO_INCORRECTO,
	ERROR_SOLICITUD,
	NO_SELECCIONO_ARCHIVO,
  ERROR_AGREGAR_PROYECTO,
	ERROR_MODIFICAR,
	ERROR_ELIMINAR,
	ERROR_AGREGAR,
	ARCHIVO_CIERRE_DANADO,
	DESCARGA_ARCHIVO_FTP_ERRONEA,
	ENVIOS_NO_ENCONTRADOS,
	ERROR_PUBLICAR;
	
  public String getKey() {
    return this.name().toLowerCase();
  }

}
