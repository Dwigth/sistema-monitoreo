import { Socket } from 'socket.io';
import * as express from 'express';
import { Application } from 'express';
import { createServer } from 'http';
import * as socketio from 'socket.io';
import axios from 'axios';
/**
 * ================================================
 * 
 *  Importaciones de base de datos
 * 
 * ================================================
 */
import { createConnection, getRepository } from 'typeorm';
import { MonitoredSystem, } from './entities/MonitoredSystem';
import { MonitorConfiguration } from './entities/MonitorConfiguration';

createConnection().then(async connection => {
    const config = await getRepository(MonitorConfiguration).findOne({ where: { activated: 'true' } });
    const systems = await getRepository(MonitoredSystem).find({ relations: ['websites', 'databases', 'webservices'] })

    const app: Application = express();
    const http = createServer(app);
    const io = socketio(http);
    const FETCH_INTERVAL = config.timeInterval;

    const URLs = [
        'https://citavehicular.sf.tabasco.gob.mx/',
        'https://sidie.sf.tabasco.gob.mx/',
        'http://tcitavehicular.spf.tabasco.local/'
    ];

    // Conexión de socket.io

    io.on('connection', (socket: Socket) => {

        setInterval(async () => {

            const systemPromises = systems.map(async system => {
                // console.log(system);

                // Si hay sitios web accedemos a ellos
                let websites = (system.websites != null) ? await Promise.all(system.websites.map(async website => {
                    // Accediendo a estatuses de las páginas web
                    const response = {
                        websiteUrl: website.url,
                        responseStatus: {}
                    }
                    const axiosResponse = await axios.get(website.url).catch(e => e.response);
                    response.responseStatus = axiosResponse.status
                    return response;

                })) : null;

                return {
                    id: system.id,
                    system: system.systemName,
                    websites
                }
            });

            const responses = await Promise.all(systemPromises).then(data => data.map(urlResponse => urlResponse)).catch(error => error)
            socket.emit('websites-info', { responses });
        }, FETCH_INTERVAL);
        console.log('Se ha conectado el cliente.');
    });

    http.listen(3000, () => {
        console.log('listening on *:3000');
    });

}).catch(error => console.log(error));