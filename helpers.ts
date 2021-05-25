// Error Handling, etc...
import * as xml from 'xml-js';
import * as moment from 'moment';
const objgrep = require('object-grep');

import { AlertMail } from "./email";
import { MonitoredSystem } from "./entities/MonitoredSystem";
import { MonitorSystemsErrorsHistory } from "./entities/MonitoredSystemsErrorsHistory";
import { MonitoredWebService } from "./entities/MonitoredWebService";
import { MonitorErrorsCatalog } from "./entities/MonitorErrorsCatalog";
import { MonitorGlobalConfiguration } from "./entities/MonitorGlobalConfiguration";
import { MonitorSystemsErrors } from "./entities/MonitorSystemsErrors";
import { getRepository, getManager } from "typeorm";

export const ErrorMsg = (name, description) => `${name} ha sufrido un error del tipo: ${description}`;
export const WebServiceErrorMsg = (wsname, val, expectedValue) => 'Ha ocurrido un error con ' + wsname + `. Valor recibido: ${val}, Valor esperado: ${expectedValue}`;

export async function ErrorHandler(system: MonitoredSystem, statusCode: number, type?: string, msg?: string) {
    if (statusCode >= 201) {
        const globalConfiguration = await getRepository(MonitorGlobalConfiguration).findOne();
        const errorCat = await getRepository(MonitorErrorsCatalog).findOne({ where: { code: statusCode } });
        if (errorCat) {
            const latestError = await getRepository(MonitorSystemsErrors).findOne({ where: { system: system, error: errorCat } });
            if (latestError === undefined) {
                try {
                    const systemError = new MonitorSystemsErrors();
                    let SystemErrorHistory = new MonitorSystemsErrorsHistory();

                    systemError.error = errorCat;
                    systemError.system = system;
                    systemError.timestamp = new Date();
                    systemError.description = (msg != undefined) ? msg : ErrorMsg(type, errorCat.description);

                    SystemErrorHistory.error = errorCat;
                    SystemErrorHistory.system = system;
                    SystemErrorHistory.timestamp = new Date();
                    SystemErrorHistory.description = (msg != undefined) ? msg : ErrorMsg(type, errorCat.description);
                    await getManager().save(systemError);
                    await getManager().save(SystemErrorHistory);
                    if (globalConfiguration.enableNotifications) {
                        const alertEmail = new AlertMail();
                        alertEmail.CurrentSystem = system;
                        await alertEmail.SendEmail();
                    } else {
                        console.error(new Error('Las notificaciones no están activadas.'))
                    }
                } catch (error) {
                    console.log(error);

                }
            } else {
                console.log('El error persiste');
            }
        }
    } else {
        console.log(`[Verificando si hay errores en este sistema][${system.systemName}]`, moment().utc(true).format('YYYY-MM-DD HH:mm:ss'));
        const lastErrors = await getRepository(MonitorSystemsErrors).find({ where: { system: system } });
        if (lastErrors.length > 0) {
            console.log('Se encontraron errores en este sistema... Procediendo a eliminarlos.', moment().utc(true).format('YYYY-MM-DD HH:mm:ss'));
            console.log(lastErrors);
            lastErrors.forEach(error => getRepository(MonitorSystemsErrors).remove(error));
        }
    }
}
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
                if (r === {}) {
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