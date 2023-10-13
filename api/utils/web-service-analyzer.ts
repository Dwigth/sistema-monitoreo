import { MonitoredWebService } from "../entities/MonitoredWebService";
import * as xml from 'xml-js';
import objgrep from 'object-grep';
import { ErrorHandler } from "./error-handler";
import { WebServiceErrorMsg } from "./error-message";

/**
 * 
 */
export async function AnalizingWebServiceContent(ws: MonitoredWebService, response: string) {
    let type = '';
    switch (ws.responseType) {
        case 'string':
            response = response.trim();
            if (response.indexOf(ws.isOkValue) < 0 || response === '') {
                ErrorHandler(ws.system, 206, `El servicio web "${ws.name}"`, WebServiceErrorMsg(ws.name, response, ws.isOkValue));
                console.log('Ha ocurrido un error con ', ws.name);
                return;
            }
            // console.log('Todo está bien.');
            break;
        case 'json':
            response = JSON.parse(JSON.stringify(response));
            const val = response[ws.property];
            let expectedValue = '';
            if (['number', 'boolean'].includes(ws.propertyDataType)) {
                expectedValue = JSON.parse(ws.isOkValue);
            } else {
                // Es un string
                expectedValue = ws.isOkValue;
            }
            // console.log(val, expectedValue);

            // console.log(response, ws.property, typeof val, typeof JSON.parse(ws.isOkValue));
            if (val !== expectedValue || val === '') {
                ErrorHandler(ws.system, 206, `El servicio web "${ws.name}"`, WebServiceErrorMsg(ws.name, val, ws.isOkValue));
                console.log('Ha ocurrido un error con ' + ws.name, `Valor recibido: ${val}, Valor esperado: ${expectedValue}`);
                return;
            }
            // console.log('Todo está bien');
            break;
        case 'xml':
            const result = xml.xml2js(response, { compact: true });
            try {
                let r = objgrep.objectGrep(result, ws.isOkValue);
                if (r === undefined || r === null || Object.values(r).length === 0) {
                    ErrorHandler(ws.system, 204, ws.name, WebServiceErrorMsg(ws.name, response, ws.isOkValue))
                    console.log('Ha ocurrido un error con ' + ws.name);
                }
            } catch (error) {
                console.log(error);
            }

            break;
        default:
            break;
    }
}