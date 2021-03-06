package mx.org.kaana.libs;

import java.awt.Color;

public final class Constantes {
	private Constantes() {}
	
  public static final String NOMBRE_RESOURCES             = "janal";
  public static final String NOMBRE_MESSAGE               = "mantic";
  public static final String JANAL_DEFAULT_PROPERTIES     = "janal.properties";
  public static final String KAJOOL_PROPERTIES            = "mantic.properties";
  public static final String NOMBRE_DE_APLICACION					= "mantic";
  public static final String NOMBRE_FORMULARIO						= ":datos:";
  public static final String RUTA_CLASES									= "/WEB-INF/classes/";
  public static final String RUTA_TEMPORALES							= "Temporal/";
  public static final String RUTA_IMAGENES_MENU						= "/resources/janal/icon/menu/";
  public static final String RUTA_IMAGENES								= "/resources/janal/img/sistema/";
  public static final String REDIRECIONAR									= "?faces-redirect=true";
  public static final String REDIRECIONAR_AMPERSON				= "&faces-redirect=true";
	public static final String JAVAX_FACES_RESOURCE         = "javax.faces.resource";
	public static final String VERSIONES										= "Versiones";

  public static final String ESPACIO											= "&nbsp;";
  public static final String BR														= "<br>";
  public static final String EOL													= "\r\n";
  public static final String ENTER												= "\n";
  public static final String ARCHIVO_PATRON_SEPARADOR			= "_";
  public static final String ARCHIVO_PATRON_NOMBRE				= "kajool";
  public static final String NOMBRE_ARCHIVO_DEFAULT				= "SinNombre";
  public static final String CAMPO_LLAVE									= "id";
  public static final String NOMBRE_FINAL_CLASE_DTO				= "Dto";

  // Constantes de separadores y caracteres
  public static final String SEPARADOR										= "|";
  public static final String SEPARADOR_SPLIT							= "\\|";
  public static final String TILDE												= "~";
  public static final String CIRCUNFLEJO									= "^";
  public static final String AMPERSON											= "&";
  public static final String COMILLA											= "'";

  //Constantes de SQL
  public static final String SQL_RESERVADO									= "params";
  public static final String SQL_CONDICION									= "condicion";
  public static final String SQL_VERDADERO									= "1=1";
  public static final long   SQL_MAXIMO_REGISTROS						= 100L;
  public static final long   SQL_TOPE_REGISTROS							= 2000L;
  public static final long   SQL_TODOS_REGISTROS						=-1L;
  public static final int    SQL_PRIMER_REGISTRO						= 1;
	public static final int    SI															= 1;
	public static final int    NO															= 2;

  //Constantes para la lectura del xml
  public static final String DML_IDENTICO										= "identically";
  public static final String DML_DINAMICO										= "dinamico";
  public static final String DML_SELECT											= "row";
  public static final String DML_ACTUALIZAR_TODOS						= "rows";
  public static final String DML_ELIMINAR_TODOS							= "rows";
  public static final String DML_RESERVADO									= "view";
	public static final String XML_PROYECTO_LOAD              = "load";
	public static final String XML_PROYECTO_MAPPING           = "mapping";
	public static final String XML_PROYECTO_BEANS             = "backing";
	public static final String XML_PROYECTO_DTO               = "dto";
	public static final String XML_PROYECTO_ID                = "id";
	public static final String XML_PROYECTO_MSG               = "msg";

  // Constates para importar archivos
  public static final String RUTA_IMPORTADOS								= RUTA_TEMPORALES.concat("/Files/");
	public static final String RUTA_IMPORTADOS_DBF						= RUTA_TEMPORALES.concat("/Dbf/");
  public static final String IMPORTAR_REFERENCIA						= "_IMPORTAR";

  // Constantes para REPORTES
  public static final String REPORTE_REFERENCIA      				= "_REPORTE";
  public static final String REPORTE_SQL             				= "REPORTE_SQL";
  public static final String REPORTE_REGISTROS       				= "REPORTE_REGISTROS";
  public static final String REPORTE_IMAGENES        				= "REPORTE_IMAGENES";
  public static final String REPORTE_TITULOS         				= "REPORTE_TITULOS";
  public static final String REPORTE_SUBREPORTE      				= "REPORTE_SUBREPORTE";
  public static final String REPORTE_VERSION								= "REPORTE_VERSION";

  public static Color [] COLORES														= {new Color(230,230,230), Color.BLACK, Color.WHITE, Color.GRAY,Color.BLUE,Color.RED,Color.YELLOW};
  public static final Long USUARIO_ACTIVO										= 1L;
  public static final String PERMITIR_ACCESO								= "1";

  public static final String PROPIEDAD_SISTEMA_SERVIDOR			= "sistema.servidor";
  public static final String PROPIEDAD_SISTEMA							= "sistema";
  public static final String PROPIEDAD_TEMPORALES						= "temporales";
  public static final String SEPARADOR_PROPIEDADES					= ".";

  public static final String MENSAJE_SISTEMA								= "Mensaje del sistema";
  //Atributo autentifica
  public static final String ATRIBUTO_AUTENTIFICA						= "autentifica";
  //Atributo para usuarios del sitio
  public static final String ATRIBUTO_USUARIOS_SITIO				= "usuariosSitio";
  public static final String ATRIBUTO_BLOQUEO_USUARIOS			= "bloqueoUsuario";

	//Atributos utilizados para las tablas en las paginas de filtro
  public static final String NO_EXISTEN_REGISTROS						= "No existen registros";
  public static final int REGISTROS_POR_PAGINA							= 15;
	public static final String ICONOS_DE_PAGINACION						= "{CurrentPageReport}  {FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink} {RowsPerPageDropdown}";
	public static final String REGISTROS_POR_CADA_PAGINA			= "10,15,20";

  //Atributo que indica que estilo se estable como inicial en el sistema
  public static final String TEMA_INICIAL										= "sentinel";
  public static final String _VISTA_DINAMICO						    = "kajool0DvistaDinamico";

  // Constantes de inicio y salida del sistema
  public static final String CLAVE_ACCESO_SISTEMA						= "0001";
  public static final String CLAVE_SALIDA_SISTEMA						= "0002";
  public static final String CLAVE_MODULO_							    = "0000";

  public static final String PAQUETE_DEFAULT_DB							= "mx.org.kaana.kajool.db.";
  public static final String PAQUETE_TRANSFORMACION					= "mx.org.kaana.kajool.procesos.";
  public static final String PAQUETE_MANAGED_BEAN_REGISTER	= "mx.org.kaana.";
	
	public static final int INTENTOS                          = 3;
  public static final int DIAS_CORTE												= 3;

  public static final String GRAFICA_REFERENCIA							= "_GRAFICA";
	
	public static final String PASSWORD_ZIP								    = "oX561r#Yn2%4wp$v";
	public static final String DIRECTORIO_WS_CLAVE_APPLICACION= "DGA_JAVA_";

  public static final String LANZADOR_INTERPRETE            = "LANZADOR";
  public static final String LANZADOR_PAGINA_INTERPRETE     = "lanzador?faces-redirect=true";
	
	public static final int MAX_OPCIONES_ULTIMO_NIVEL         = 12;

	// Constantes para mantenimiento de encuestas
	public static final int MINDMAP_MIN_PERFILES              =2;
	public static final int MINDMAP_MIN_OFICINAS              =7;
	public static final int MINDMAP_MIN_MENUS									=3;
	public static final int MINDMAP_MIN_USUARIOS              =1;
	public static final int MINDMAP_MIN_USUARIOS_AGREGADOS    =0;
		
	
	
  public String getNO_EXISTEN_REGISTROS() {
    return Constantes.NO_EXISTEN_REGISTROS;
  }

  public Integer getREGISTROS_POR_PAGINA() {
    return Constantes.REGISTROS_POR_PAGINA;
  }
	
  public String getICONOS_DE_PAGINACION() {
    return Constantes.ICONOS_DE_PAGINACION;
  }

	public String getREGISTROS_POR_CADA_PAGINA() {
    return Constantes.REGISTROS_POR_CADA_PAGINA;
  }
	
}
