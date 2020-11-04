import { Socket } from 'socket.io';
import * as express from 'express';
import { Application } from 'express';
import { createServer } from 'http';
import * as socketio from 'socket.io';
import axios from 'axios';


const app: Application = express();
const http = createServer(app);
const io = socketio(http);
const FETCH_INTERVAL = 10000;

const URLs = [
    'https://citavehicular.sf.tabasco.gob.mx/',
    'https://sidie.sf.tabasco.gob.mx/',
    'http://tcitavehicular.spf.tabasco.local/'
];

io.on('connection', (socket: Socket) => {

    setInterval(async () => {

        // Accediendo a estatuses de las páginas web
        const urlPromises = URLs.map(async url => {
            const response = {
                websiteUrl: url,
                responseStatus: {}
            }
            const axiosResponse = await axios.get(url).catch(e => e.response);
            response.responseStatus = axiosResponse.status
            return response;
        });

        const responses = await Promise.all(urlPromises).then(data => data.map(urlResponse => urlResponse)).catch(error => error)
        socket.emit('websites-info', { responses });
    }, FETCH_INTERVAL);
    console.log('Se ha conectado el cliente.');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
