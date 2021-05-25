/**
 * ================================================
 * 
 *  Pre-inicio
 * 
 * ================================================
 */
// const dash = require('appmetrics-dash');
require('dotenv').config()

/**
 * ================================================
 * 
 *  Importaciones globales
 * 
 * ================================================
 */

import { Socket } from 'socket.io';
import * as express from 'express';
import { Application } from 'express';
import { createServer } from 'http';
import * as socketio from 'socket.io';
import axios, { AxiosResponse } from 'axios';
import * as cors from 'cors';
import * as moment from 'moment';

/**
 * ================================================
 * 
 *  Importaciones de base de datos
 * 
 * ================================================
 */
import { ConnectionManager, createConnection, getRepository } from 'typeorm';
import { MonitoredSystem, } from './entities/MonitoredSystem';
import { MonitorConfiguration } from './entities/MonitorConfiguration';
import { REST } from './rest';
import { ErrorHandler, AnalizingWebServiceContent } from './helpers';

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
    app.use(express.json())

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

            // Separar los servicios que sirven para verificar las bases de datos
            let wsToDelete = [];
            webservices.forEach((ws, i) => {
                if (ws.name.indexOf(':DB') >= 0) {
                    databases.push(ws);
                    wsToDelete.push(ws)
                }
            })

            webservices = webservices.filter(ws => !wsToDelete.includes(ws))
            const response = {
                id: system.id,
                systemName: system.systemName,
                upDate: system.upDate,
                websites,
                webservices,
                databases,
                errors: system.errors
            };
            return response;
        });

        _SYSTEMS = await Promise.all(systemPromises).then(data => data.map(urlResponse => urlResponse)).catch(error => error)
        io.emit('websites-info', { responses: _SYSTEMS, lastUpdate: `Última actualización: ${moment().utc(true).format('YYYY-MM-DD HH:mm:ss')}` })

    }, FETCH_INTERVAL);

    // Conexión de socket.io
    io.on('connection', (socket: Socket) => {
        socket.emit('websites-info', { responses: _SYSTEMS, lastUpdate: `Última actualización: ${moment().utc(true).format('YYYY-MM-DD HH:mm:ss')}` })
        console.log('Se ha conectado el cliente.');
    });

    // Servir la aplicacion
    app.use('/', express.static(__dirname.replace('server', 'monitoreo')));

    // Rutas 
    REST(app)

    http.listen(3009, () => {
        console.log('listening on *:3009');
    });

    // dash.monitor({ server: http });

}).catch(error => console.log(error));
