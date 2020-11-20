const dash = require('appmetrics-dash');
import { Socket } from 'socket.io';
import * as express from 'express';
import { Application } from 'express';
import { createServer } from 'http';
import * as socketio from 'socket.io';
import axios, { AxiosResponse } from 'axios';
import * as cors from 'cors';
import * as xml from 'xml-js';
const objgrep = require('object-grep');
/**
 * ================================================
 * 
 *  Importaciones de base de datos
 * 
 * ================================================
 */
import { ConnectionManager, createConnection, getManager, getRepository } from 'typeorm';
import { MonitoredSystem, } from './entities/MonitoredSystem';
import { MonitorConfiguration } from './entities/MonitorConfiguration';
import { MonitorErrorsCatalog } from './entities/MonitorErrorsCatalog';
import { MonitorSystemsErrors } from './entities/MonitorSystemsErrors';
import { MonitoredWebService } from './entities/MonitoredWebService';

/**
 * ================================================
 * 
 *  Variables globales
 * 
 * ================================================
 */

let _SYSTEMS: MonitoredSystem[] = [];

createConnection().then(async connection => {
    const config = await getRepository(MonitorConfiguration).findOne({ where: { activated: 1 } });
    const systems = await getRepository(MonitoredSystem).find({ relations: ['websites', 'databases', 'webservices', 'errors'] })

    const app: Application = express();
    const http = createServer(app);
    const io = socketio(http);
    const FETCH_INTERVAL = config.timeInterval || 10000;

    // Enviamos por primera vez los datos al usuario
    _SYSTEMS = systems;

    // Middlewares
    app.use(cors())

    // Proceso de monitoreo

    setInterval(async () => {
        const systems = await getRepository(MonitoredSystem).find({ relations: ['websites', 'databases', 'webservices', 'errors'] })
        const systemPromises = systems.map(async system => {
            // console.log(system);
            _SYSTEMS = [];

            // Si hay sitios web accedemos a ellos
            let websites = (system.websites != null) ? await Promise.all(system.websites.map(async website => {
                // Accediendo a estatuses de las páginas web
                const response = {
                    name: website.name,
                    url: website.url,
                    statusResponseCode: 0,
                }
                const axiosResponse = await axios.get(website.url).catch(e => e.response);
                response.statusResponseCode = axiosResponse.status;
                await ErrorHandler(system, response.statusResponseCode, website.name);
                return response;

            })) : [];

            let webservices = (system.webservices != null) ? await Promise.all(system.webservices.map(async webservice => {
                // Accediendo a estatuses de las páginas web
                webservice.system = system;
                const response = {
                    name: webservice.name,
                    url: webservice.url,
                    statusResponseCode: 0,
                }
                const axiosResponse: AxiosResponse = await axios.get(webservice.url, { headers: { token: webservice.token } }).catch(e => e.response);
                response.statusResponseCode = axiosResponse.status;
                try {
                    await AnalizingWebServiceContent(webservice, axiosResponse.data);
                } catch (error) {
                    console.log(error);
                }
                await ErrorHandler(system, response.statusResponseCode, webservice.name);
                return response;

            })) : [];

            let databases = (system.databases != null) ? await Promise.all(system.databases.map(async database => {
                // console.log(database);
                let isConnected = false;
                try {
                    const connectionManager = new ConnectionManager();
                    let postgres = {
                        //@ts-ignore
                        type: database.type,
                        host: database.host,
                        port: database.port,
                        username: database.username,
                        password: database.password,
                        database: database.databaseName,
                    };
                    let oracle = {
                        //@ts-ignore
                        type: database.type,
                        host: database.host,
                        port: database.port,
                        sid: database.sid,
                        username: database.username,
                        password: database.password,
                        database: database.databaseName,
                    }
                    let connection;
                    if (database.type === 'postgres') {
                        // @ts-ignore
                        connection = connectionManager.create(postgres);
                    } else if (database.type === 'oracle') {
                        // @ts-ignore
                        connection = connectionManager.create(oracle);
                    }
                    const connectResult = await connection.connect();
                    isConnected = connectResult.isConnected;
                    await connectResult.close();
                } catch (error) {
                    console.log(error);
                }

                const response = {
                    name: database.name,
                    url: database.host,
                    statusResponseCode: (isConnected) ? 200 : 500,
                }
                await ErrorHandler(system, response.statusResponseCode, database.name);
                return response;

            })) : [];

            return {
                id: system.id,
                systemName: system.systemName,
                upDate: system.upDate,
                websites,
                webservices,
                databases,
                errors: system.errors
            }
        });

        _SYSTEMS = await Promise.all(systemPromises).then(data => data.map(urlResponse => urlResponse)).catch(error => error)
        io.emit('websites-info', { responses: _SYSTEMS })

    }, FETCH_INTERVAL);

    // Conexión de socket.io
    io.on('connection', (socket: Socket) => {
        socket.emit('websites-info', { responses: _SYSTEMS })
        console.log('Se ha conectado el cliente.');
    });

    // Servir la aplicacion
    app.use('/', express.static(__dirname.replace('server', 'monitoreo')));

    http.listen(3009, () => {
        console.log('listening on *:3009');
    });

    dash.monitor({ server: http });

}).catch(error => console.log(error));

// Error Handling, etc...

const ErrorMsg = (name, description) => `${name} ha sufrido un error del tipo: ${description}`;

async function ErrorHandler(system: MonitoredSystem, statusCode: number, type?: string, msg?: string) {
    if (statusCode >= 201) {

        const errorCat = await getRepository(MonitorErrorsCatalog).findOne({ where: { code: statusCode } });
        if (errorCat) {
            const latestError = await getRepository(MonitorSystemsErrors).findOne({ where: { system: system, error: errorCat } });
            if (latestError === undefined) {
                try {
                    const systemError = new MonitorSystemsErrors();
                    systemError.error = errorCat;
                    systemError.system = system;
                    systemError.timestamp = new Date();
                    systemError.description = (msg != undefined) ? msg : ErrorMsg(type, errorCat.description);
                    await getManager().save(systemError);

                } catch (error) {
                    console.log(error);

                }
            }
        }
    }
}
/**
 * 
 */
async function AnalizingWebServiceContent(ws: MonitoredWebService, response: string) {
    let type = '';
    switch (ws.responseType) {
        case 'string':
            response = response.trim();
            if (response.indexOf(ws.isOkValue) < 0 || response === '') {
                ErrorHandler(ws.system, 206, `El servicio web "${ws.name}"`);
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
                ErrorHandler(ws.system, 206, `El servicio web "${ws.name}"`);
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
                    ErrorHandler(ws.system, 204, ws.name)
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