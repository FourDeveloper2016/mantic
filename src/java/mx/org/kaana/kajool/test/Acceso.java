package mx.org.kaana.kajool.test;

import mx.org.kaana.libs.formato.BouncyEncryption;

/**
 * @company KAANA
 * @project KAJOOL (Control system polls)
 * @date 16/08/2016
 * @time 12:03:45 PM
 * @author Team Developer 2016 <team.developer@kaana.org.mx>
 */
public class Acceso {

  /**
   * @param args the command line arguments
   */
  public static void main(String[] args) throws Exception {
    String password = "lfIEvqtK8CeM6/9niY5beA==";
    System.out.println(BouncyEncryption.decrypt(password));
    System.out.println(BouncyEncryption.encrypt("castilla"));
    System.out.println(BouncyEncryption.encrypt("tirso"));
    System.out.println(BouncyEncryption.encrypt("jimenez"));
    System.out.println(BouncyEncryption.encrypt("vicencio"));
  }
}
