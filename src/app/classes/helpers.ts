export function COPY(str) {
    try {
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
          if (result.state == "granted" || result.state == "prompt") {
            /* write to the clipboard now */
            console.log('Con permiso');
            navigator.clipboard.writeText(str).then(function() {
              /* clipboard successfully set */
              console.log('Se copió wuuu');
              
            }, function() {
                console.log('No se pudo copiar');
                
              /* clipboard write failed */
            });
          } else {
            console.log('Sin permiso');
            
          }
        });
      } catch (error) {
        console.error(error);
        
      }
}