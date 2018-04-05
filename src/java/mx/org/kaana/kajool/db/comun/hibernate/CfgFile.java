package mx.org.kaana.kajool.db.comun.hibernate;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import mx.org.kaana.libs.formato.Error;
import mx.org.kaana.libs.recurso.Configuracion;
import mx.org.kaana.kajool.init.Settings;
import mx.org.kaana.xml.Modulos;
import mx.org.kaana.xml.Modulos.Paths;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.cfg.Configuration;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.bootstrap.DOMImplementationRegistry;
import org.w3c.dom.ls.DOMImplementationLS;
import org.w3c.dom.ls.LSSerializer;
import org.xml.sax.SAXException;

public class CfgFile {

  private static final Log LOG = LogFactory.getLog(CfgFile.class);
  private static final String KEY_CONNECTION = "/connection/session-factory/property";
  private static final String KEY_CFG_BASE   = "session-factory";
	private static final String PACKAGE_DEFAULT= "mx.org.kaana.kajool.db";
  private Document source;

  public CfgFile() throws ParserConfigurationException, SAXException, IOException {
    init();
  }

  public Document getSource() {
    return source;
  }

  private void setSource(Document source) {
    this.source = source;
  }

  private void init() throws ParserConfigurationException, SAXException, IOException {
    DocumentBuilderFactory fabrica= DocumentBuilderFactory.newInstance();
    DocumentBuilder builder = fabrica.newDocumentBuilder();
    String nameXml= Configuracion.getInstance().getHibernateCustomMapping().trim();
    InputStream in= this.getClass().getResourceAsStream(nameXml);
    // kajool default hibernate-mapping.xml
    if(in== null)
      in= this.getClass().getResourceAsStream(Settings.getInstance().getDefaultHibernateMapping());
    setSource(builder.parse(in));
    toBuild();
  }

  private Element getFirstElement(String key) {
    Element regresar = null;
    try {
      NodeList items = getSource().getElementsByTagName(key);
      if (items.getLength() > 0) {
        LOG.debug("key element [".concat(key).concat("] ").concat(items.item(0).getNodeName()));
        regresar = (Element) items.item(0);
      } // for x
    } // try
    catch (Exception e) {
      Error.mensaje(e);
    } // catch
    return regresar;
  }

  private void loadElements(Document dmls, String key, String children) {
    try {
      XPath xpath = XPathFactory.newInstance().newXPath();
      NodeList items = (NodeList) xpath.evaluate(children, dmls, XPathConstants.NODESET);
      if (items != null && items.getLength() > 0) {
        Element first = getFirstElement(key);
        LOG.info("Inicializando " + items.getLength() + " ".concat(key));
        for (int x = 0; x < items.getLength(); x++) {
          first.appendChild(getSource().importNode(items.item(x), true));
        } // for x
      } // if
    } // try
    catch (Exception e) {
      Error.mensaje(e);
    } // catch
  }

  private void toBuild() {
    DocumentBuilderFactory fabrica = null;
    DocumentBuilder builder        = null;
    InputStream inputStream        = null;
    try {
      fabrica       = DocumentBuilderFactory.newInstance();
      builder       = fabrica.newDocumentBuilder();
      String nameXml= Configuracion.getInstance().getHibernateCustomFile().trim();
      inputStream   = this.getClass().getResourceAsStream(nameXml);
      if (inputStream!= null) {
        Document dmls = builder.parse(inputStream);
        LOG.debug("Procesando archivo de conexion ".concat(KEY_CONNECTION));
        loadElements(dmls, KEY_CFG_BASE, KEY_CONNECTION);
      }
      else
        LOG.debug("No existe el archivo ".concat(nameXml).concat(" de configuraicon de Hibernate. !"));
    } // try
    catch (Exception e) {
      Error.mensaje(e);
    } // catch
  } // sections

  public List<File> getPackageContent(String packageName) throws IOException {
		List<File> regresar   = new ArrayList<File>();
		Enumeration<URL> urls = Thread.currentThread().getContextClassLoader().getResources(packageName);
    File[] files  = null;
    File dir      = null;
    URL url       = null;
		while(urls.hasMoreElements()) {
			url   = urls.nextElement();
			dir   = new File(url.getFile());
      files =  toFilesDirectory(dir);
      for (File clase:files) {
        regresar.add(clase);
      } // for
		} // while
		return regresar;	
  }

  private List toClasses (String paquete) throws IOException {
    List regresar         = new ArrayList();
    regresar.addAll( ClassFinder.findClassesMapping(paquete));
    return regresar;
  }

  public void toBuildMetaData(Configuration metaData) {
    List<String> listPackage = new ArrayList<String>();
    List         clases      = null;		
    Modulos modulos          = null;
    try {
      listPackage.add(PACKAGE_DEFAULT.concat(".view.dto"));	
      modulos = new Modulos(Configuracion.getInstance().toFileModule());
      modulos.load(listPackage, PACKAGE_DEFAULT, Paths.PACKAGE);
      for (String paquete: listPackage) {
				if (paquete != null) {
					clases =  toClasses(paquete);
					if (clases!= null) {
						 for (int i=0;i<clases.size();i++) {
							 try {
								 metaData.addAnnotatedClass((Class)clases.get(i));
							 } // try
							 catch (Exception e) {
								 //LOG.error(e.getMessage());
							 } // catch
						 } // for
					} // if
				} // if	
			} // for
    } // try
		catch (Exception e) {
      Error.mensaje(e);
    } // catch
  }

  private File[] toFilesDirectory(File directory) {
    File[] files = null;
    if (directory.isDirectory()) {
      files = directory.listFiles(new FileFilter() {
        public boolean accept(File file) {
          return file.getName().endsWith(".class");
        }
      });
    }
    return files;
  }

  @Override
  public String toString() {
    String regresar = null;
    DOMImplementationRegistry registry = null;
    DOMImplementationLS domImpl = null;
    LSSerializer writer = null;
    try {
      registry = DOMImplementationRegistry.newInstance();
    } // try
    catch (Exception e) {
      Error.mensaje(e);
    } // catch
    domImpl = (DOMImplementationLS) registry.getDOMImplementation("LS");
    writer  = domImpl.createLSSerializer();
    regresar= writer.writeToString(getSource());
    return regresar;
  }

}
