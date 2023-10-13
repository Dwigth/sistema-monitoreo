import { DataSource } from "typeorm";
import { MonitorConfiguration } from "./entities/MonitorConfiguration";
import axios, { AxiosResponse } from "axios";
import * as moment from "moment";
import { AppDataSource } from "./data-source";
import { MonitoredSystem } from "./entities/MonitoredSystem";
import { ErrorHandler } from "./utils/error-handler";
import { AnalizingWebServiceContent } from "./utils/web-service-analyzer";
import { Server } from "socket.io";
import { SystemCallResponse } from "./types";

/**
 * 
 * @param config 
 * @param connection 
 * @param io 
 */
export const IntervalSync = (config: MonitorConfiguration, connection: DataSource, io: Server) => {
    let _SYSTEMS: MonitoredSystem[] = [];
    const FETCH_INTERVAL = config.timeInterval || 10000;

    setInterval(async () => {
        const systems = await connection.getRepository(MonitoredSystem).find({ relations: ['websites', 'databases', 'webservices', 'errors'] })
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
                const response: SystemCallResponse = {
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
                    const connectionManager = AppDataSource;
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
                        connection = new DataSource(postgres);
                    } else if (database.type === 'oracle') {
                        // @ts-ignore
                        connection = new DataSource(oracle);
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
            let wsToDelete: SystemCallResponse[] = [];
            webservices.forEach((ws: SystemCallResponse, i) => {
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

    }, FETCH_INTERVAL)
}