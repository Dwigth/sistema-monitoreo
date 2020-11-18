import { Socket } from 'socket.io';
import * as express from 'express';
import { Application } from 'express';
import { createServer } from 'http';
import * as socketio from 'socket.io';
import axios, { AxiosResponse } from 'axios';
import * as cors from 'cors';
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

createConnection().then(async connection => {
    const config = await getRepository(MonitorConfiguration).findOne({ where: { activated: 1 } });
    const systems = await getRepository(MonitoredSystem).find({ relations: ['websites', 'databases', 'webservices'] })

    const app: Application = express();
    const http = createServer(app);
    const io = socketio(http);
    const FETCH_INTERVAL = config.timeInterval;

    // Middlewares
    app.use(cors())

    // Conexión de socket.io
    io.on('connection', (socket: Socket) => {

        setInterval(async () => {

            const systemPromises = systems.map(async system => {
                // console.log(system);

                // Si hay sitios web accedemos a ellos
                let websites = (system.websites != null) ? await Promise.all(system.websites.map(async website => {
                    // Accediendo a estatuses de las páginas web
                    const response = {
                        name: website.name,
                        url: website.url,
                        statusResponseCode: {},
                    }
                    const axiosResponse = await axios.get(website.url).catch(e => e.response);
                    response.statusResponseCode = axiosResponse.status
                    return response;

                })) : [];

                let webservices = (system.webservices != null) ? await Promise.all(system.webservices.map(async webservice => {
                    // Accediendo a estatuses de las páginas web
                    const response = {
                        name: webservice.name,
                        url: webservice.url,
                        statusResponseCode: {},
                    }
                    const axiosResponse: AxiosResponse = await axios.get(webservice.url, { headers: { token: webservice.token } }).catch(e => e.response);
                    response.statusResponseCode = axiosResponse.status
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

            const responses = await Promise.all(systemPromises).then(data => data.map(urlResponse => urlResponse)).catch(error => error)
            socket.emit('websites-info', { responses });
        }, FETCH_INTERVAL);
        console.log('Se ha conectado el cliente.');
    });

    // Servir la aplicacion
    app.use('/', express.static(__dirname.replace('server', 'monitoreo')));

    http.listen(3009, () => {
        console.log('listening on *:3009');
    });

}).catch(error => console.log(error));