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
import "reflect-metadata";
import { Server, Socket } from 'socket.io';
import * as moment from 'moment';

/**
 * ================================================
 * 
 *  Importaciones de base de datos
 * 
 * ================================================
 */
import { MonitoredSystem, } from './entities/MonitoredSystem';
import { AppDataSource } from "./data-source";
import { IntervalSync } from "./interval-sync";
import { StartSequence } from "./init";
import { getConfig } from "./utils/get-config";


export const main = (io: Server,) => {

    let _SYSTEMS: MonitoredSystem[] = [];

    AppDataSource.initialize().then(async connection => {
        let config = await getConfig();
        while (config == null) {
            const sequence = new StartSequence();
            await sequence.InsertAll();
            config = await getConfig();
        }
        const systems = await connection.getRepository(MonitoredSystem).find({ relations: ['websites', 'databases', 'webservices', 'errors'] })
        _SYSTEMS = systems;

        IntervalSync(config, AppDataSource, io)

        // Conexión de socket.io
        io.on('connection', (socket: Socket) => {
            socket.emit('websites-info', { responses: _SYSTEMS, lastUpdate: `Última actualización: ${moment().utc(true).format('YYYY-MM-DD HH:mm:ss')}` })
            console.log('Se ha conectado el cliente.');
        });


    }).catch(error => console.log(error));
}