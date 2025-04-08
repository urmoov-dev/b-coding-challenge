export function setToValue(obj:{[key:string]: any}, value: any, path:string) {
    var a = path.split('.')
    var o = obj
    while (a.length - 1) {
      var n = a.shift()
      if (n !== undefined && !(n in o)) o[n] = {}
      o = o[n as string]
    }
    o[a[0]] = value
  }

export function isEmpty(obj: Object) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true
}

/**
 * @param  {{[x: string]: any}} obj object to be searched
 * 
 * @param {any} item specific value to be found
 * 
 * @returns {string[]} array of individual properties representing the indexed path as strings 
 */
export function find(obj: { [x: string]: any }, item: any):string[]|null {
  for(var key in obj) {                                   
      if(obj[key] && typeof obj[key] === "object") {      
          var result = find(obj[key], item);              
          if(result) {                                    
              result.unshift(key);                        
              return result;                              
          }
      } else if(obj[key] === item) {                      
          return [key];                                   
      }
  }
  return null
}

/**
 * @param  {{[x: string]: any}} obj object to be searched
 * 
 * @param {any} item specific value to be found
 * 
 * @returns {string} formatted path array into a string
 */
export function findFormatted(obj: {[x: string]: any}, item: any) {
  var path = find(obj, item);                             
  if(path == null) {                                      
      return "";                                          
  }
  return `myObj["${path.join('"]["')}"]`;
  }