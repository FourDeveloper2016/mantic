/*
 *company KAANA
 *project KAJOOL (Control system polls)
 *date 11/06/2014
 *time 06:17:55 PM
 *author Team Developer 2016 <team.developer@kaana.org.mx>
 */
(function(window) {
  var janal;
  var currentEvent= $.Event('onJanal');
  window.isMobile= {
    Android: function() {
      return navigator.userAgent.match(/Android/i)!== null? true: false;
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i)!== null? true: false;
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i)!== null? true: false;
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i)!== null? true: false;
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i)!== null? true: false;
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };    
  
  if(window.Janal) {
    Console.debug("Janal already loaded, ignoring duplicate execution.");
    return;
  }

  /*
   * Defined namespace for Janal
   */
  Janal= {};
  Janal.Control= {
    name: [],
    stage: [100,101,115,97,114,114,111,108,108,111],
    form: 'datos', 
    display: 'growl',
    growl: 'mensajes',
    lock: 'bloqueo',
    errors: 3
  };
  
  /*
   * Defined functions core for Janal
   */
  Janal.Control.Functions= Class.extend({
  	daysInMonth : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    root        : [47,73,75,84,65,78],
    logger      : false,
    stage       : 'desarrollo',
    init: function(root) {
      $self= this;
      $self.console('Janal.Control.Function.init');
      if(typeof(root)!== 'undefined')
        this.root   = root;
      $self.load(0, ['core/jquery.janal.sticky.min-1.0.0.js','js/jquery.janal.menu-2.0.1.js','core/jquery.longclick-1.0.0.js', 'core/jquery.validate.min-1.15.0.js', 'core/jquery.meio.mask.min-1.1.14.js', 'core/jquery.janal.fns.min-1.1.8.js']);
      $self.console('Janal.Control.Function.init resource loaded');
    },
    dateFormat: function(format) {
      var date= new Date();
      var yyyy = date.getFullYear().toString();
      format = format.replace(/yyyy/g, yyyy);
      var mm = (date.getMonth()+1).toString(); 
      format = format.replace(/mm/g, (mm[1]?mm:"0"+mm[0]));
      var dd  = date.getDate().toString();
      format = format.replace(/dd/g, (dd[1]?dd:"0"+dd[0]));
      var hh = date.getHours().toString();
      format = format.replace(/hh/g, (hh[1]?hh:"0"+hh[0]));
      var ii = date.getMinutes().toString();
      format = format.replace(/ii/g, (ii[1]?ii:"0"+ii[0]));
      var ss  = date.getSeconds().toString();
      format = format.replace(/ss/g, (ss[1]?ss:"0"+ss[0]));
      return format;
    }, // dateFormat
    console: function(msg) {
      if("produccion"!==$self.toUnicodeString($self.stage) || $self.logger)
        console.log('INFO '+ this.dateFormat('yyyy-mm-dd hh:ii:ss')+ ': '+ msg);
    }, // console
    cache: function(url, options, count, items) {
      // Allow user to set any option except for dataType, cache, and url
      options = $.extend(options || {}, {
        dataType: "script",
        cache: false,
        async: false,
        url  : url,
        complete: function(jqXHR, textStatus) {
          if(count< items.length) 
            $self.load(count, items);
        }
      });
      // Use $.ajax() since it is more flexible than $.getScript
      // Return the jqXHR object so we can chain callbacks
      return $.ajax(options);      
    }, // cache
    load: function(count, items) {  
      // name= '/resources/js/jquery/jquery.float.thead.min-1.2.7.js'; // dentro del web app
      var url= '/resources/janal/'+ items[count]; // '/janal/' para cuando esta dentro de un *.jar
      $self.cache(this.toContext()+ url, {}, count+ 1, items)
      .done(function(script, status) {
         $self.console(url+ ' loaded');
      }) // done
      .fail(function(jqxhr, settings, exception) {
        $self.console(url+ ' load error '+ exception);
        alert('Desarrollador:\n    Fallo la carga de las librerias de Janal \n    revisar por favor la consola del navegador\n    y notifique a su jefe del error.!\n'+ url+ '\n\n     Error: '+ exception);
      }); // fail
    }, // load
    loadJS: function(items) {  
      $self.load(0, items);
    },
    empty: function(value) {
      return value=== null || $.trim(value).length=== 0;
    }, // empty
    vector: function(data, separators) {
      return data.split(new RegExp(separators.join('|'), 'g'));
    }, // vector
    remove: function(value, characters) {
      return value.replace(new RegExp(characters.join('|'), 'g'), '');
    }, // remove
    cleanToken: function(value) {
      var separators= ['\\\ ', '\\\,', '\\\$', '\\\(', '\\\)'];
      return this.remove(value, separators);
    }, // cleanToken
    isNonnegativeInteger: function(s) {
      var args = false;
      if(arguments.length > 1)
        args= arguments[1];
      return(this.isSignedInteger(s, args) && ((this.empty(s) && args)  ||(parseInt(s, 10)>= 0)));
    }, // isNonnegativeInteger
    isSignedInteger: function(s) {
      if(this.empty(s))
        if(arguments.length === 1)
          return false;
        else
          return(arguments[1] === true);
      else {
        var start= 0;
        var args = false;
        if(arguments.length > 1)
          args = arguments[1];
        if((s.charAt(0) === "-") ||(s.charAt(0) === "+") )
          start = 1;
        return(this.isInteger(s.substring(start, s.length), args))
      }
    }, // isSignedInteger
    isInteger: function(s) {
      if(this.empty(s))
        if(arguments.length === 1)
          return false;
        else
          return(arguments[1] === true);
      for(var i= 0; i< s.length; i++) {
        var c= s.charAt(i);
        if(!this.isDigit(c))
          return false;
      } // for
      return true;
    }, // isInteger
    isDigit: function(value) {
      return (value >= 0 && value <= 9);
    }, // isDigit
    isIntegerInRange: function(s, a, b) {
      if(this.empty(s))
        if(arguments.length === 1)
          return true;
        else
          return(arguments[1] === true);
       if(!this.isInteger(s, false))
         return false;
       return((parseInt(s, 10) >= a) &&(parseInt(s, 10) <= b));
    }, // isIntegerInRange
    isYear: function(s) {
       if(this.empty(s))
         if(arguments.length === 1)
           return false;
         else
           return(arguments[1] === true);
       if(!this.isNonnegativeInteger(s))
         return false;
       return((s.length=== 2) ||(s.length === 4));
     }, // isYear
     isMonth: function(s) {
       if(this.empty(s))
         if(arguments.length === 1)
           return false;
       else
         return(arguments[1] === true);
       return this.isIntegerInRange(s, 1, 12);
     }, // isMonth
     isDay: function(s) {
       if(this.empty(s))
         if(arguments.length === 1)
           return false;
         else
           return(arguments[1] === true);
       return this.isIntegerInRange(s, 1, 31);
     }, // isDay
     februaryDays: function(year) {
       return(((year % 4 === 0) &&((!(year % 100 === 0)) ||(year % 400 === 0)))? 29: 28);
     }, // februaryDays
     isDate: function(year, month, day) {
       if(!(this.isYear(year, false) && this.isMonth(month, false) && this.isDay(day, false)))
         return false;
       var $year = parseInt(year, 10);
       var $month= parseInt(month, 10);
       var $day  = parseInt(day, 10);
       if($day> this.daysInMonth[$month- 1]) {
         if(!($month=== 2 && $day> this.februaryDays($year)))
           return true;
         else   
           return false;
       } // if
       return true;
     }, // isDate
     isCustomDate: function(s) {
       var patron = /^([\d]{2})\/([\d]{2})\/([\d]{4})$/;
       return patron.test(s) && this.isDate(s.substring(6), s.substring(3,5), s.substring(0,2));
     }, // isCustomDate
     isHour: function(hours, minutes, seconds) {  
		   if(hours>= 0 && hours <= 23) {
		     if(minutes>= 0 && minutes <= 59)
		       if(seconds>= 0 && seconds <= 59)
		         return true;
		     else
		       return false;
		   } // if
		   else
		     return false;
		 }, // isHour
     isCustomHour: function(s) {
       return this.isHour(parseInt(s.substring(0,2), 10), parseInt(s.substring(3,5), 10), parseInt(s.substring(6,8), 10));
     }, // isCustomHour
	   checksDates: function(start, end) {
	     return (this.reverseDate(start)<= this.reverseDate(end));
	   }, // checksDates
	   reverseDate: function(value) {
	     return value.substr(6, 4)+ value.substr(3, 2)+ value.substr(0, 2);
     }, // reverseDate
     build: function(kind, id, father, css) {
       var value= $('<'+ kind.toLowerCase()+ '>');
       if (!this.empty(id))
         value.attr('id', id);				    
       $.each(css.split(","), function() {
         value.addClass(String(this));
       });
       return value.appendTo(father);
     }, // build
     toUnicodeString: function(array) {
       if("string"===typeof(array))
         return array;
       else {
         var result = '';
         for (var x= 0; x< array.length; x++) 
           result+= String.fromCharCode(array[x]);
         return result;
       } // else  
     }, // toUnicodeString
     toContext: function() {
       return this.toUnicodeString(this.root)
     }, // toContext
     labels: function(id) {
       return $('label[for$="'+ id+ '"], label[for$="'+ id+ $parent.SELECT_FOCUS+ '"], label[for$="'+ id+ $parent.INPUT_RESERVE+ '"], th.'+ (id.indexOf(':')> 0? id.substring(id.indexOf(':')+ 1): id)+ '>span');
     }, // labels
     selector: function(multiple, id) {
       return 'input[id'+ multiple+ '="'+ id+ '"], input[id'+ multiple+ '="'+ id+ $parent.INPUT_RESERVE+ '"], select[id'+ multiple+ '="'+ id+ $parent.INPUT_RESERVE+ '"], textarea[id'+ multiple+ '="'+ id+ '"], input[id^="'+ id+ ':"], input[id*=":'+ id+ ':"], input[id'+ multiple+ '="'+ id+ ':"]';       
     },
     components: function(multiple, id) {
       return $(this.selector(multiple, id));
     }, // components
     inputs: function(multiple, id) {
       return $('input[id'+ multiple+ '="'+ id+ '"], input[id'+ multiple+ '="'+ id+ $parent.INPUT_RESERVE+ '"]');
     }, // inputs
     search: function(id) {
       return this.components('$', id);
     }, // search
     tabView: function(id) {
       return $('input[id$="'+ id+ '_activeIndex"]').val();
     }, // labels
     value: function(id) {
       var values= '';
       var items= $('input[id$="'+ id+ '"], input[id$="'+ id+ $parent.INPUT_RESERVE+ '"], select[id$="'+ id+ $parent.INPUT_RESERVE+ '"] option:selected, textarea[id$="'+ id+ '"], input[id^="'+ id+ ':"]:checked, input[id*=":'+ id+ ':"]:checked, input[id$="'+ id+ ':"]:checked');
       $.each(items, function(idx) {
         values+= $(this).val()+ (items.length-1!== idx? '|': '');
       });
       return values;
     }, // value
     text: function(id) {
       return this.search(id).text();
     }, // text
     fecha: function() {
       var meses= new Array ("enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre");
       var data = new Date();
       var index= data.getMonth();
       var an   = data.getYear();
       var Hora;
       var Minutos;
       var Segundos;
       var AmPm;
       if (an < 1000)
         an = 1900+ an;
       Hora= data.getHours();
       AmPm= " a.m.";
       if(Hora>= 12) 
         AmPm = " p.m.";
       if (Hora > 12)
         Hora -= 12;
       if (Hora === 0)
         Hora = 12;
       Minutos = data.getMinutes();
       if(Minutos< 10) 
         Minutos = "0" + Minutos;
       Segundos= data.getSeconds();
       if(Segundos< 10)
         Segundos = "0" + Segundos;
       texto="Hoy es "+ data.getDate()+ " de " + meses[index] +" de " + an+ "   	"+ Hora+ ":"+ Minutos+ ":"+ Segundos+ " "+ AmPm;
       $('#reloj').text( texto ).addClass("fecha	");  
       if (document.layers){
         document.layers.reloj.document.write(texto);
         document.layers.reloj.document.close();
       } // if
       else 
         if (document.all) 
           reloj.innerHTML = texto;
       setTimeout('janal.fecha()', 1500);
     }, // fecha     
     monitor:	function (value) {
      var count   = 11;
      var contador= count;									
      if(value === 0)
        clearInterval(interval);										
      else {																							
        segundos.innerHTML = "Tiempo restante: 00:00:10";
        interval = setInterval(function() {																		
          contador--;									
          if(contador> -1) {
            count= contador+ 1;
            if(contador >= 10) 
              segundos.innerHTML = "Tiempo restante: 00:00:".concat(contador.toString());				
            else 
              segundos.innerHTML = "Tiempo restante: 00:00:0".concat(contador.toString());				
          } // if
          else {						
            clearInterval(interval);
            PF('dialogoInactivo').hide();
            document.getElementById('salir').click();						
          } // else
        }, 1000);							
      } // else
	  } // monitor
  });
  
  /*
   * Defined validation for Janal
   */
  Janal.Control.Validations= Janal.Control.Functions.extend({
    // privates atributtes for class
    form          : 'datos',
    fields        : {},
    kind          : 'growl',
    message       : 'mensajes',
    stage         : 'desarrollo',
    locked        : 'bloqueo',
    INPUT_RESERVE : '_input',
    SELECT_FOCUS  : '_focus',
    JANAL_RESERVE : '\u0049\u004B\u0054\u0041\u004E',
    initialized   : false,
    offContextMenu: true,
  	errors        : {
      inputs      : [],
      masks       : [],
      validations : [],
      customs     : [],
      show        : 0
    },
    names         : {
      validations : ['libre', 'max-caracteres', 'min-caracteres', 'max-valor', 'min-valor', 'requerido', 'entero', 'entero-signo', 'valor-simple', 'telefono', 'contiene-a', 'igual-a', 'menor-a', 'mayor-a', 'asterisco', 'moneda', 'moneda-decimal', 'flotante-signo', 'flotante', 'mayusculas', 'minusculas', 'vocales', 'rango', 'secuencia-palabra', 'longitud', 'letras', 'texto', 'curp', 'rfc', 'texto-especial', 'boleano', 'resultado-entrevista-modulo', 'resultado-entrevista-basico', 'fecha', 'fecha-menor', 'fecha-mayor', 'registro', 'hora', 'hora-completa', 'hora-mayor', 'hora-menor', 'comodin', 'no-permitir', 'ipv4', 'ipv6','no-aplica', 'esta-en','correo','acceso'],
      masks       : ['libre', 'fecha', 'fecha-hora', 'registro', 'hora', 'hora-completa', 'tarjeta-credito', 'decimal', 'decimal-signo', 'letras', 'vocales', 'texto', 'numero', 'un-digito', 'dos-digitos', 'tres-digitos', 'tres-digitos-default', 'cuatro-digitos', 'cinco-digitos', 'siete-digitos', 'diez-digitos', 'entero', 'entero-blanco', 'entero-signo', 'entero-sin-signo', 'flotante', 'flotante-signo', 'rfc', 'curp', 'moneda', 'moneda-decimal', 'mayusculas', 'minusculas', 'cuenta', 'numeros-letras', 'nombre-dto', 'telefono', 'ip', 'version', 'clave-ct-call-center', 'clave-ct', 'clave-operativa', 'resultado-entrevista-basico', 'resultado-entrevista-modulo','resultado-entrevista-exacuatro' ,'no-aplica','correo','valor-simple', 'acceso'],
      watermarks  : ['entero', 'entero-signo', 'valor-simple', 'decimal', 'decimal-signo', 'flotante', 'flotante-signo', 'moneda', 'moneda-decimal', 'max-valor', 'min-valor'],
      formats     : ['libre', 'cambiar-mayusculas', 'cambiar-minusculas', 'rellenar-caracter'],
      customs     : []
    },
    // methods publics for class
    init: function(root, form, fields, kind, stage, growl, lock, showMaxError) {
      this._super(root, stage);
      this.console('Janal.Control.Validations.init');
      $parent= this;
      $parent.kind   = kind;
      $parent.stage  = stage;
      $parent.message= growl;
      $parent.lock   = lock;
      $parent.offContextMenu= "desarrollo"!==$parent.toUnicodeString(stage);
      $parent.lockContextMenu($parent.offContextMenu);
      $parent.overrideContextMenu();
      $parent.prepare(form, fields, showMaxError);  
      $parent.ready();
    }, // init
    prepare: function(form, fields, showMaxError) {
      $parent.console('Janal.Control.Validations.prepare');
      if (typeof(form)!== 'undefined')
        this.form= form;
      if (typeof(fields)!== 'undefined')
        this.fields= fields;  
      if ((typeof(showMaxError)!== 'undefined') && ($parent.isNonnegativeInteger(''+showMaxError)))
        this.errors.show= showMaxError;
      $form= $('#'+ $parent.form).validate({ignore: "ignore", onkeyup: false, onfocusout: false, focusInvalid: true, onsubmit: false, 
        errorPlacement: function(error, element) {
          $parent.format(error.text(), element.is(':checkbox')||element.is(':radio')? element.attr('name'): element.attr('id'), $parent.errors.inputs);
        }
      });      
      if(typeof($parent.lazy)!== 'undefined')
        $parent.lazy($form);
      $parent.reset();
      this.addTabIndex();
      this.initialized= true;
    }, // startUp
    display: function(kind) {
      if (typeof(kind)!== 'undefined' && 'growl|inline|classic'.indexOf(kind)>= 0)
        $parent.kind= kind;
      if(typeof(customs)!== 'undefined')
        $parent.errors.customs= customs;
    }, // display
    add: function(name, method, message) {
      var tokens= name;
      if(name.constructor!== Array)
        tokens= $parent.vector(name, ['\\\|', '\\\ ', '\\\,']);
      $.each(tokens, function() {
        if($parent.validate(String(this), $parent.names.validations.concat($parent.names.customs)))
          $parent.format('Ya existe la validaci\u00F3n ['+ String(this)+ '], cambie el nombre.', 'Personalizada', $parent.errors.validations);
      }); // each
      if($parent.errors.validations.length> 0)
        $parent.programmer($parent.errors.validations);
      else {
        $parent.names.customs= $parent.names.customs.concat(tokens);
        $.validator.addMethod(name, method, message);
      } // else  
      $parent.errors.validations= [];
    }, // add
    format: function(error, id, items) {
      //$parent.console('Janal.Control.Validations.format: '+ id+ ': '+ String(error));
      var titles= $parent.labels(id.indexOf(':')> 0? id.substring(id.lastIndexOf(':')+ 1): id.indexOf($parent.INPUT_RESERVE)> 0? id.substring(0, id.lastIndexOf($parent.INPUT_RESERVE)): id);
      if(titles.length=== 0)
        items.push({summary: 'Informativo:', detail: error, severity: 'error'});		  
      else
        $.each(titles, function() {
          if(!$(this).hasClass('janal-field-error')) {
            $(this).addClass('janal-field-error');
            items.push({summary: $(this).text().indexOf(':')> 0? $(this).text(): $(this).text()+ ':', detail: ' '+ error, severity: 'error'});		  
          } // if
        });
    }, // format
    blank: function(id, value) {
      if(typeof(value.multiple)==='undefined') {
        if(typeof($parent.fields[id].multiple)==='undefined')
          $parent.fields[id].multiple= '$';
      } // if
      else
        $parent.fields[id].multiple= value.multiple;
      if(typeof(value.mensaje)==='undefined') {
        if(typeof($parent.fields[id].mensaje)==='undefined')
          $parent.fields[id].mensaje= '';
      } // if
      else
        $parent.fields[id].mensaje= value.mensaje;
      if(typeof(value.grupo)==='undefined') {
        if(typeof($parent.fields[id].grupo)==='undefined')
          $parent.fields[id].grupo= $parent.JANAL_RESERVE;
      } // if
      else
        $parent.fields[id].grupo= value.grupo;
      if(typeof(value.mascara)==='undefined') {
        if(typeof($parent.fields[id].mascara)==='undefined')
          $parent.fields[id].mascara= 'libre';
      } // if 
      else
        $parent.fields[id].mascara= value.mascara;
      if(typeof(value.validaciones)==='undefined') {
        if(typeof($parent.fields[id].validaciones)==='undefined')
          $parent.fields[id].validaciones= 'libre';
      } // if 
      else
        $parent.fields[id].validaciones= value.validaciones;
      if(typeof(value.formatos)==='undefined') {
        if(typeof($parent.fields[id].formatos)==='undefined')
          $parent.fields[id].formatos= 'libre';
      } // if 
      else
        $parent.fields[id].formatos= value.formatos;
      if(typeof(value.individual)==='undefined') {
        if(typeof($parent.fields[id].individual)==='undefined')
          $parent.fields[id].individual= false;
      } // if 
      else
        $parent.fields[id].individual= value.individual;
    },
    cleanForm: function() {
      $parent.console('Janal.Control.Validations.cleanForm');
      $.each($parent.fields, function(id, value) {
        var $components= $parent.components(value.multiple, id);
        $.each($components, function() {
          $(this).val("");
        });
      }); // each
    }, // cleanForm
    data: function(id, value) {
      $parent.hide();
      var $components= $parent.components(value.multiple, id);
      $.each($components, function() {
        $parent.mask(id, $(this), value.mascara);
        $parent.required(id, value.validaciones, true);
        if(value.formatos!== 'libre' || value.individual)
          $(this).on('blur', function() {
            $parent.element(false, id);
          });
      });
      $parent.programmer($parent.errors.masks);
    },
    reset: function() {
      $parent.console('Janal.Control.Validations.reset');
      $parent.clean();
      $parent.errors.masks= [];
      $.each($parent.fields, function(id, value) {
        $parent.blank(id, value);
        $parent.data(id, value);
      }); // each
    }, // reset
    refresh: function(items) {
      $parent.console('Janal.Control.Validations.refresh');
      $parent.errors.masks= [];
      if (typeof(items)=== "string")
        items= $parent.vector(items, ['\\\|', '\\\,', '\\\ ']);
      $.each($parent.fields, function(id, value) {
        if(typeof(items)=== 'undefined' || items.length=== 0 || items.indexOf(id)>= 0 || items.indexOf(value.grupo)>= 0) 
          $parent.data(id, value);
      }); // each
    }, // refresh
    renovate: function(id, value) {
      $parent.console('Janal.Control.Validations.renovate');
      if($parent.fields[id]) {
        $parent.blank(id, value);
        $parent.refresh([id]);
      } // if  
      else
        $parent.show([{summary: 'No existe el ID', detail: 'El elemento llamado['+ id+ '] no existe !!!'}]);
    }, // refresh
    whatIsIt: function(object) {
      var stringConstructor = "janal".constructor;
      var arrayConstructor = [].constructor;
      var objectConstructor = {}.constructor;
        if (object === null)
            return 'null';
        else 
          if (object === undefined) 
            return 'undefined';
          else 
            if (object.constructor === stringConstructor) 
              return 'String';
           else 
             if (object.constructor === arrayConstructor) 
               return 'Array';
             else 
               if (object.constructor === objectConstructor) 
                 return 'Object';
               else
                 return 'don t know';
    }, // whatIsIt
    mask: function(id, component, mask) {
      if($parent.whatIsIt(mask)=== 'String' && mask.indexOf('{')=== 0) {
        try {
          component.setMask($.parseJSON(mask));
        } // try
        catch(e) {
          $parent.format('Los parametros de la mascara ['+ mask+ '] son incorrectos ', id, $parent.errors.masks);
        } // catch
      } // if
      else
        if($parent.whatIsIt(mask)=== 'Object') {
          try {
            component.setMask(mask);
          } // try
          catch(e) {
            $parent.format('Los parametros de la mascara ['+ mask+ '] son incorrectos ', id, $parent.errors.masks);
          } // catch
        } // if
        else
          if($parent.validate(mask, $parent.names.masks)) {
            if(mask!== 'no-aplica') {
              component.attr('alt', mask);
              component.setMask();
            } // if  
          } // if  
          else
            $parent.format('No existe la mascara ['+ mask+ ']', id, $parent.errors.masks);
    }, // mask     
    cut: function(name) {
      return $.trim(name.indexOf('(')>= 0? name.substring(0, name.indexOf('(')): name);
    }, // cut
    complete: function(name) {
      return $.trim(name.indexOf('(')>= 0? name: name+ '({"default": "'+ $parent.JANAL_RESERVE+ '"})');
    }, // complete
    // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
    normalize: function(id, component, data, message) {
      if (typeof data === "string") {
        var tokens= $parent.vector(data, ['\\\(', '\\\)']);
        var $json = {messages: {}};
        try {
          $json[tokens[0]]= $.parseJSON(tokens[1]);
        } // try
        catch(e) {
          $parent.format('Los parametros de la validaci\u00F3n ['+ tokens[0]+ '] son incorrectos '+ tokens[1], id, $parent.errors.validations);
        } // catch
        if(!$parent.empty(message))
          $json.messages[tokens[0]]= message;
        data = $json;
      } // if
      return data;
    }, // normalize
    rules: function(id, component, methods, message) {
      $.each(methods, function() {
        var method= $parent.cut(this);
        if($parent.validate(method, $parent.names.validations.concat($parent.names.formats).concat($parent.names.customs))) {
          if(method!== 'no-aplica')
            component.rules('add', $parent.normalize(id, component, $parent.complete(String(this)), message));
        } // if  
        else
          $parent.format('No existe la validaci\u00F3n ['+ method+ ']', id, $parent.errors.validations);
      }); // each
    }, // rules
    required: function(id, method, colocate) {
      if(method.indexOf('requerido')>= 0) {
        var titles= $parent.labels(id);
        $.each(titles, function() {
          if(colocate)
            $(this).text(($(this).text().indexOf('*')< 0? '*': '')+ $(this).text());
          else
            $(this).text($(this).text().indexOf('*')>= 0? $(this).text().substring(1): $(this).text());
        });
      } // if
    }, // required
    validate: function(value, names) {
      return names.indexOf(value)>= 0;
    }, // validate
    hide: function() {
      $('label, th>span').removeClass('janal-field-error');
      $('#growl_container').remove();
      if(typeof(PF($parent.message))!== 'undefined')
        PF($parent.message).removeAll();
      $parent.errors.inputs= [];
    }, // hide
    clean: function() {
      $parent.console('Janal.Control.Validations.clean');
      $.each($parent.fields, function(id, value) {
        $parent.blank(id, value);
        var $components= $parent.components(value.multiple, id);
        $.each($components, function() {
          $(this).unsetMask();
          $(this).css('text-align', 'left');
          $(this).rules('remove');
          $parent.required(id, value.validaciones, false);
        });
      }); // each
      $parent.hide();
    }, // clean
    isWaterMark: function(methods) {
      $.each(methods, function() {
        if($parent.names.watermarks.indexOf($parent.cut(this))>= 0)
          return true;
      });
      return false;
    }, // isWaterMark
    cleanMarks: function() {
      $.each($parent.fields, function(id, value) {
        if(typeof(value.multiple)==='undefined')
          value.multiple= '$';
        var $components= $parent.inputs(value.multiple, id);
        $.each($components, function() {
          if($parent.isWaterMark($parent.vector(value.validaciones, ['\\\|'])))
            $(this).val($parent.cleanToken($(this).val()));
        });
      }); // each
    }, // cleanMarks
    show: function(items) {
      switch($parent.kind) {
        case 'classic':
          $parent.classic(items);
          break;
        case 'inline':
          $parent.inline(items);
          break;
        case 'growl':
          $parent.growl(items);
          break;
      }; // switch
    }, // show
    classic: function(items) {
      if(typeof(PF($parent.message))!== 'undefined') {
        PF($parent.message).removeAll();			
        PF($parent.message).show(items.concat($parent.errors.customs));
      } // if  
    }, // classic
    growl: function(items) {
      var container= $parent.build('div', 'growl_container', $('#'+ $parent.form), 'ui-growl,ui-widget');
      container= $parent.build('div', '', container, 'ui-growl-item-container,ui-state-highlight,ui-corner-all,ui-helper-hidden,ui-shadow');
      container.css({'display': 'block'});
      container= $parent.build('div', '', container, 'ui-growl-item');
      $('<a href="#" onclick="$(this).parent().parent().slideUp();" style="float:right;cursor:pointer"><span class="ui-icon ui-icon-close"></span></a>').appendTo(container);
      $parent.build('span', '', container, 'ui-growl-image, ui-growl-image-error');
      $parent.detail(items, container);
    }, // growl
    inline: function(items) {
      var container= $parent.build('div', 'growl_container', $('body'), 'ui-messages,ui-widget');
      container.insertBefore($('#'+ $parent.form));
      container= $parent.build('div', '', container, 'ui-messages-error,ui-corner-all');
      $('<a href="#" class="ui-messages-close" onclick="$(this).parent().slideUp();return false;"><span class="ui-icon ui-icon-close"></span></a>').appendTo(container);
      $parent.build('span', '', container, 'ui-messages-error-icon');
      $parent.detail(items, container);
    }, // inline
    detail: function(items, container) {
      $parent.build('br', '', container, '');
      var $container= $parent.build('ul', '', container, '');
      var allItems= items.concat($parent.errors.customs);
      $.each(allItems, function(index) {
        if(typeof(this.severity)=== 'undefined')
          this.severity= 'error';
        var $li  = $parent.build('li', '', $container, '');
        var $span= $parent.build('span', '', $li, 'ui-messages-'+ this.severity+ '-summary');
        $span.text(this.summary);
        $span= $parent.build('span', '', $li, 'ui-messages-'+ this.severity+ '-detail');
        $span.text(this.detail);
        if(($parent.errors.show> 0) && ((index+ 1)>= $parent.errors.show)) {
          $parent.build('br', '', container, '');
          var $count= $parent.build('div', '', container, 'janal-align-right janal-font-bold');
          $count.text('Total de errores: '+ allItems.length+ '');
          $parent.build('br', '', container, '');
          return false;
        };
      });
    }, // detail
    programmer: function(items) {
      if(items.length> 0) {
        var msg= 'Errores encontrados en Janal.Control.fields:\n\n';
        $.each(items, function(idx, value){
          msg += (idx+ 1)+ '.- ['+ value.summary+ '] '+ value.detail+ '\n';
        });
        msg += '\nDesarrollador:\n    Favor de corregir los errores ortogr\u00E1ficos.';
        alert(msg);
      } // if  
    }, // programmer
    addTabIndex: function() {
      var idx= 1;	   
      $('#'+ $parent.form).each(function() {
        $('*', this).not('*[for]').each(function() {              
          if ($(this).is('input:text, input:checkbox, input:radio, select, textarea, button')) {         
            if (!$(this).is(':disabled'))
              $(this).attr('tabIndex', idx++);
          } // if
        });
      });        
      $parent.keyEnter();
      setTimeout(function(){$('*[tabIndex=1]').focus();}, 1000);
	  }, // addTabIndex
    keyEnter: function() {
      $('input:text, input:radio, input:checkbox, select, button').on('keydown', function(e) {
	  		$parent.move(e, $(this)); 
  		});
    }, // keyEnter
    move: function(event, element) {
      var keyCode= event.keyCode? event.keyCode: event.which? event.which: event.charCode;
      if (keyCode=== 13) {
        var $components= $('*[tabIndex='+ (parseInt(element.attr('tabIndex'), 10)+ 1)+'], *[tabIndex=1]');
        $.each($components, function() {
          if($components.length=== 1)
            $(this).focus();
          else
            if(parseInt($(this).attr('tabIndex'), 10)!== 1)
              $(this).focus();
        });
        event.preventDefault();
      } // if
    }, // move    
    apply: function(group, clear) {
      $parent.console('Janal.Control.Validations.apply');
      $parent.errors.validations= [];
      $.each($parent.fields, function(id, value) {
        var $components= $parent.components(value.multiple, id);
        $.each($components, function() {
					if(typeof(clear) === 'undefined' || clear)
						$(this).rules('remove');
          if(group=== $parent.JANAL_RESERVE || value.grupo.indexOf(group)>= 0)
            $parent.rules(id, $(this), $parent.vector(value.validaciones, ['\\\|']), value.mensaje);
        });
      }); // each
      $parent.programmer($parent.errors.validations);
    }, // apply
    check: function(customs, blockui) {
      $parent.console('Janal.Control.Validations.check');
      $parent.hide();
      if(typeof(customs)!== 'undefined' && typeof(customs)!== 'boolean')
        $parent.errors.customs= customs;
      if((typeof(customs)!== 'undefined' && typeof(customs)=== 'boolean' && customs) || (typeof(blockui)!== 'undefined' && blockui))
        $parent.bloquear();
      var ok= $('#'+ $parent.form).valid() && $parent.errors.customs.length=== 0;
      if(ok) 
        $parent.cleanMarks();
      else
        $parent.show($parent.errors.inputs);
      $parent.errors.customs= [];
      if((typeof(customs)!== 'undefined' && typeof(customs)=== 'boolean' && customs) || (typeof(blockui)!== 'undefined' && blockui))
        $parent.desbloquear();
      return ok;
    }, // check    
    update: function(fields) {
      $parent.console('Janal.Control.Validations.update '+ fields);
      $parent.clean();
      $parent.fields= fields;
      $parent.reset();
    }, // update
    change: function(form, fields) {
      $parent.console('Janal.Control.Validations.update '+ fields);
      $parent.clean();
      $parent.prepare(form, fields);
    }, // update
    execute: function(customs, blockui) {
      $parent.console('Janal.Control.Validations.execute');
      $parent.apply($parent.JANAL_RESERVE);
      return $parent.check(customs, blockui);
    }, // execute
    partial: function(group, customs, blockui) {
      $parent.console('Janal.Control.Validations.partial');
      var tokens= $parent.vector(group, ['\\\|', '\\\ ', '\\\,']);
      $.each(tokens, function(idx) {
        $parent.apply(String(this), idx=== 0);
      }); // each
      return $parent.check(customs, blockui);
    }, // partial
    element: function(all, field, blockui) {
      $parent.console('Janal.Control.Validations.element');
      $parent.errors.validations= [];
      $.each($parent.fields, function(id, value) {
        if(id=== field) {
          // search all components with same selector
          $parent.data(false, id, value);
          var $components= $parent.components(value.multiple, id);
          $.each($components, function() {
						$(this).rules('remove');
            var complete= value.formatos;
            if(all || value.individual)
              if(complete.endsWith('|'))
                complete+= value.validaciones;
              else
                complete+= '|'+ value.validaciones;
            $parent.rules(id, $(this), $parent.vector(complete, ['\\\|']), '');
          });
        } // if  
      }); // each
      $parent.programmer($parent.errors.validations);
      $parent.hide();
      if(typeof(blockui)!== 'undefined' && blockui)
        $parent.bloquear();
      var validator= $('#'+ $parent.form).validate();
      var ok=  validator.element($('#'+ $parent.form).find($parent.selector('$', field)));
      if(ok) 
        $parent.cleanMarks();
      else
        $parent.show($parent.errors.inputs);
      if(typeof(blockui)!== 'undefined' && blockui)
        $parent.desbloquear();
      return ok;
    }, 
    individual: function(field, blockui) {
      $parent.console('Janal.Control.Validations.individual');
      return $parent.element(true, field, blockui);
    },
    exportTable: function(name, data) {
      $parent.bloquear();
      var ok= $("#"+ data+ " div.ui-dt-c:contains('No existen registros')").text().length> 0;
      if(ok) {
        $parent.hide();
        $parent.show([{summary: "Error del sistema", detail: "No existen registro que exportar"}]);
        $parent.desbloquear();
      } // else
      else	
        $('#'+ name).click(); 
      return !ok;
    }, // exportTable
	  overrideContextMenu: function () {
      $(document).on("click", "span.janal-context-menu", function(event) {
        event.stopImmediatePropagation();
        var row = parseInt($(this).attr('data-ri'));
        var menu= $(this).is('[data-cm]')? $(this).attr('data-cm'): $(this).attr('janal-menu')!== undefined ? $(this).attr('janal-menu'): 'kajoolContextMenu';
        var data= $(this).is('[data-dt]')? $(this).attr('data-dt'): 'kajoolTable';
        if(PF(data)) {
          PF(data).onRowClick(event, PF(data).findRow(row), true);
          PF(data).writeSelections();
        } // if 
        if(PF(menu))
          PF(menu).show(event);
      });
    },// overrideContextMenu  
    lockContextMenu: function(server) {
      $parent.console('Janal.Control.Validations.lockContextMenu');
      if(typeof(server)!== 'undefined')
        $parent.offContextMenu= server;
      $(document).bind('contextmenu', function(e) { 
        return !($parent.offContextMenu);
      });       
    },
    hideStackMenu: function() {
      $parent.console('Janal.Control.Validations.hideStackMenu');
      if(PF('stackMenu'))
        PF('stackMenu').collapse(PF('stackMenu').jq.children('img'));
      $('.ui-stack').bind('mousedown', function(e) { 
        if(e.button=== 2 || e.button=== 3) { 
          $('.ui-stack').hide();        
          return false;
        } // if
        else
          return true;
      }); 
    },
		toCorreoHtml : function() {		
      $parent.bloquear();
      var styles       = "";
      var clasesABuscar= [];
      var clasesSplit  = [];
      var encontrado   = false;
      var newForm = $("#tablaCorreos").clone();
      newForm.find('.ui-menubutton').remove();
      newForm.find("*").each(function () {
        if (typeof $(this).attr("class") !== "undefined" ) {
          clasesSplit =$(this).attr("class").split(" ");
          $.each(clasesSplit, function( index, value ) {
            if (clasesABuscar.indexOf(value) === -1)
              clasesABuscar.push(value);
          });
        } // if
      });
      $.each(document.styleSheets,function (key,value) {
          $.each(value.cssRules,function (keyRuleCss,valueRuleCss) {
            if (typeof valueRuleCss.selectorText !== "undefined" ) {
              encontrado = false;
              $.each(valueRuleCss.selectorText.split(" "), function( index, value ) {
                if ( clasesABuscar.indexOf( value.substring(1,value.length))!==  -1)
                  encontrado = true;
              });
              if (encontrado)
                styles =styles+valueRuleCss.cssText+" ";
            } // if
          });
      }); 
      remoteTablaCorreos([{name:'text',value:newForm.html()},{name:'styleText',value:styles}]);
      //remoteTabla({text:'$("#tabla").text()'});
    }, // toCorreoHtml
    bloquear: function() {
      if (typeof($parent.locked)!== 'undefined')
        PF($parent.locked).show();
      return true;
    }, // bloquear
    desbloquear: function() {
      if (typeof($parent.locked)!== 'undefined')
        PF($parent.locked).hide();
    }, // desbloquear
		cerrarDialogo: function() {
			this.desbloquear();
			PF('dialogoConfirmacion').hide();
		}, // cerrarDialogo
    custom: function(item) {
      var container= $parent.build('div', 'growl_container', $('#'+ $parent.form), 'ui-growl,ui-widget');
      container= $parent.build('div', '', container, 'ui-growl-item-container,ui-state-highlight,ui-corner-all,ui-helper-hidden,ui-shadow');
      container.css({'display': 'block'});
      container= $parent.build('div', '', container, 'ui-growl-item');
      $('<a href="#" onclick="$(this).parent().parent().slideUp();" style="float:right;cursor:pointer"><span class="ui-icon ui-icon-close"></span></a>').appendTo(container);
      if(typeof(item.severity)=== 'undefined')
        item.severity= 'error';
      $parent.build('span', '', container, 'ui-growl-image, ui-growl-image-'+ item.severity);
      var $span= $parent.build('span', '', container, 'ui-messages-'+ item.severity+ '-summary');
      $span.text(item.summary);
      $parent.build('br', '', container, '');
      $span= $parent.build('span', '', container, 'ui-messages-'+ item.severity+ '-detail');
      $span.text(item.detail);
    }, // custom    
    info: function(msg) {
      $parent.custom({summary: 'Información:', detail: msg, severity: 'info'});
    }, // info
    warn: function(msg) {
      $parent.custom({summary: 'Precaución:', detail: msg, severity: 'warn'});
    }, // warn
    error: function(msg) {
      $parent.custom({summary: 'Error:', detail: msg, severity: 'error'});
    }, // error
    alert: function(msg) {
      $parent.custom({summary: 'Kajool:', detail: msg, severity: 'info'});
    }, // alert
    version: function() {
      return '0.1.3.7';
    }, // version
    align: function(pixels) {
      try {
        if(typeof(pixels)=== 'undefined')
          pixels= 15;
        $('div.sticky-wrapper').css('top', ($('div.sticky-wrapper').position().top- pixels)+ 'px');      
      } // try  
      catch(e) {
      } // catch
    }, // align
    integer: function(value, start) {
      return isNaN(parseInt(value, 10))? typeof(start)!== 'undefined'? start: 0: parseInt(value, 10);
    },
    ready: function() {
      $parent.console('Janal.Control.Validations.ready');
      if(typeof($parent.start)!== 'undefined')
        $parent.start();
      else
        $parent.console('Janal.Control.Validations.start not implemented !');
    } // ready
  });
  window.Janal= Janal;
})(window);

$(document).mousedown(function(e) {
  currentEvent= e;
});

$(document).ready(function() {
  janal= new Janal.Control.Validations(Janal.Control.name, Janal.Control.form, Janal.Control.fields, Janal.Control.display, Janal.Control.stage, Janal.Control.growl, Janal.Control.lock, Janal.Control.errors);
  $('#tabla_selection').val('');
  console.info('Janal.Control.Validations.initialized: '+ janal.initialized);
});


