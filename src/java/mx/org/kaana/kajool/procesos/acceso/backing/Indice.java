package mx.org.kaana.kajool.procesos.acceso.backing;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import javax.faces.bean.RequestScoped;
import mx.org.kaana.libs.Constantes;
import mx.org.kaana.kajool.procesos.acceso.reglas.Acceso;
import mx.org.kaana.libs.pagina.JsfBase;
import mx.org.kaana.libs.pagina.UIMessage;
import mx.org.kaana.kajool.db.comun.hibernate.DaoFactory;
import mx.org.kaana.kajool.db.comun.sql.Entity;
import mx.org.kaana.kajool.procesos.acceso.beans.Cliente;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import mx.org.kaana.libs.formato.Error;
import mx.org.kaana.libs.pagina.IBaseFilter;
import mx.org.kaana.libs.reflection.Methods;
import mx.org.kaana.kajool.db.comun.sql.Value;
import mx.org.kaana.kajool.enums.EAccion;
import mx.org.kaana.kajool.procesos.mantenimiento.temas.backing.TemaActivo;
import mx.org.kaana.kajool.procesos.usuarios.reglas.Transaccion;

/**
 *@company KAANA
 *@project KAJOOL (Control system polls)
 *@date 21/08/2015
 *@time 12:27:03 PM
 *@author Team Developer 2016 <team.developer@kaana.org.mx>
 */

@ManagedBean(name="kajoolIndice")
@RequestScoped
public class Indice extends IBaseFilter implements Serializable {

  private static final long serialVersionUID = 5323749709626263801L;
  private Cliente cliente;
  @ManagedProperty(value="#{kajoolTemaActivo}")
  private TemaActivo temaActivo;
  private static final Log LOG=LogFactory.getLog(Indice.class);	

  @Override
	@PostConstruct
  protected void init() {
  	setCliente(new Cliente("", "", "Bienvenido(a)", "", ""));		
  }

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

  public TemaActivo getTemaActivo() {
    return temaActivo;
  }

  public void setTemaActivo(TemaActivo temaActivo) {
    this.temaActivo = temaActivo;
  }

  public String doIngresar() {
		String regresar           = null;
		Acceso acceso             = null;
		String estilo             = null;
		Value value               = null;
		Map<String, Object> params= null;				
		try {				
			params= new HashMap();			
		  acceso= new Acceso(getCliente());			
      acceso.valida();
      params.put(Constantes.SQL_CONDICION, "cuenta='".concat(getCliente().getCuenta()).concat("'"));
      value= DaoFactory.getInstance().toField("TcJanalEmpleadosDto", "row", params, "curp");
      if((value.getData()!= null) && (getCliente().getContrasenia().equals(value.toString().substring(0, 10)))) {				
        JsfBase.setFlashAttribute("cliente", getCliente());
        regresar= "/Exclusiones/confirmacion.jsf".concat(Constantes.REDIRECIONAR);
      } // if
      else {
        regresar= acceso.toForward();		
        estilo  = JsfBase.getAutentifica().getEmpleado().getEstilo();
        this.temaActivo.setName(estilo!= null ? estilo : Constantes.TEMA_INICIAL);	
      } // if  
		} // try
		catch(Exception e) {
			Error.mensaje(e);
			JsfBase.addMessageError(e);
		} // catch	
		finally {
			Methods.clean(params);
		}  // finally
		return regresar;
  } // doIngresar
	
  public void doVerificarCuenta() {
    LOG.info("Verificando cuenta de usuario para recuperar...");
    Entity vistaUsuario = null;
    Map param           = new HashMap();
    try{
      param.put("cuenta", getCliente().getRecuperar());
			param.put("curp", getCliente().getCurp());
      vistaUsuario = (Entity)DaoFactory.getInstance().toEntity("VistaTcJanalUsuariosDto", "recuperar", param);
      if(vistaUsuario!=null){
        reiniciarContrasenia(vistaUsuario.toLong("idKey"));
				getCliente().setCuenta("");
				getCliente().setCurp("");
        JsfBase.addMessage("Se reinicio la contrase�a con �xito.");
      }// if
      else{
        JsfBase.addMessage("Verifique su cuenta/CURP para recuperar su contrase�a.");
      }// else			
    }// catch
    catch(Exception e){
      Error.mensaje(e);
      JsfBase.addMessage("Error al recuperar la contrase�a.");
    }
  } // doVerificarCuenta

  private boolean reiniciarContrasenia(Long idEmpleado) throws Exception{
		Transaccion transaccion   = null;
		Map<String, Object> params= null;
		boolean regresar          = false;
    try {
			params= new HashMap();
			params.put("idEmpleado", idEmpleado);
			transaccion= new Transaccion(params);
			regresar= transaccion.ejecutar(EAccion.RESTAURAR);
		} // try
		catch(Exception e) {
			Error.mensaje(e);
      JsfBase.addMessage(UIMessage.toMessage("error_solicitud"));
		} // catch
		finally {
			Methods.clean(params);
		} // finally
		return regresar;
  } // enviarCorreo

	@Override
	public void doLoad() {
	}

}
