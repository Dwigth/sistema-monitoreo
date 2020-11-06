"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const http_1 = require("http");
const socketio = require("socket.io");
const axios_1 = require("axios");
/**
 * ================================================
 *
 *  Importaciones de base de datos
 *
 * ================================================
 */
const typeorm_1 = require("typeorm");
const MonitoredSystem_1 = require("./entities/MonitoredSystem");
const MonitorConfiguration_1 = require("./entities/MonitorConfiguration");
typeorm_1.createConnection().then((connection) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const config = yield typeorm_1.getRepository(MonitorConfiguration_1.MonitorConfiguration).findOne({ where: { activated: 'true' } });
    const systems = yield typeorm_1.getRepository(MonitoredSystem_1.MonitoredSystem).find({ relations: ['websites', 'databases', 'webservices'] });
    const app = express();
    const http = http_1.createServer(app);
    const io = socketio(http);
    const FETCH_INTERVAL = config.timeInterval;
    const URLs = [
        'https://citavehicular.sf.tabasco.gob.mx/',
        'https://sidie.sf.tabasco.gob.mx/',
        'http://tcitavehicular.spf.tabasco.local/'
    ];
    // Conexión de socket.io
    io.on('connection', (socket) => {
        setInterval(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const systemPromises = systems.map((system) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                // console.log(system);
                // Si hay sitios web accedemos a ellos
                let websites = (system.websites != null) ? yield Promise.all(system.websites.map((website) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    // Accediendo a estatuses de las páginas web
                    const response = {
                        websiteUrl: website.url,
                        responseStatus: {}
                    };
                    const axiosResponse = yield axios_1.default.get(website.url).catch(e => e.response);
                    response.responseStatus = axiosResponse.status;
                    return response;
                }))) : null;
                return {
                    id: system.id,
                    system: system.systemName,
                    websites
                };
            }));
            const responses = yield Promise.all(systemPromises).then(data => data.map(urlResponse => urlResponse)).catch(error => error);
            socket.emit('websites-info', { responses });
        }), FETCH_INTERVAL);
        console.log('Se ha conectado el cliente.');
    });
    http.listen(3000, () => {
        console.log('listening on *:3000');
    });
})).catch(error => console.log(error));
//# sourceMappingURL=server.js.map