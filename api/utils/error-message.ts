export const ErrorMsg = (name, description) => `${name} ha sufrido un error del tipo: ${description}`;
export const WebServiceErrorMsg = (wsname, val, expectedValue) => 'Ha ocurrido un error con ' + wsname + `. Valor recibido: ${val}, Valor esperado: ${expectedValue}`;
