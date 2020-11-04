"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const http_1 = require("http");
const socketio = require("socket.io");
const axios_1 = require("axios");
const app = express();
const http = http_1.createServer(app);
const io = socketio(http);
const FETCH_INTERVAL = 10000;
const URLs = [
    'https://citavehicular.sf.tabasco.gob.mx/',
    'https://sidie.sf.tabasco.gob.mx/',
    'http://tcitavehicular.spf.tabasco.local/'
];
io.on('connection', (socket) => {
    setInterval(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        // Accediendo a estatuses de las páginas web
        const urlPromises = URLs.map((url) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const response = {
                websiteUrl: url,
                responseStatus: {}
            };
            const axiosResponse = yield axios_1.default.get(url).catch(e => e.response);
            response.responseStatus = axiosResponse.status;
            return response;
        }));
        const responses = yield Promise.all(urlPromises).then(data => data.map(urlResponse => urlResponse)).catch(error => error);
        socket.emit('websites-info', { responses });
    }), FETCH_INTERVAL);
    console.log('Se ha conectado el cliente.');
});
http.listen(3000, () => {
    console.log('listening on *:3000');
});
//# sourceMappingURL=server.js.map