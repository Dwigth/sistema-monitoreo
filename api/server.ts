import * as cors from "cors";
import * as express from "express";
import { createServer } from 'http';
import * as socketio from 'socket.io';
import { attachPerson, getSystems, resolveIssue } from "./operations/systems";
import * as ViteExpress from "vite-express";
import { main } from "./main";

const app = express();
const http = createServer(app);
export const io = new socketio.Server(http);

main(io);
console.log('hello')

// Middlewares
app.use(cors())
app.use(express.json())

// Servir la aplicacion
app.use('/', express.static(__dirname.replace('server', 'monitoreo')));

// Rutas 
app.delete('/resolve/issue/:id', async (req, res) => resolveIssue({ req, res }));

app.get('/systems/all', async (req, res) => getSystems(res));

app.post('/systems/attach/person-to-system', async (req, res) => attachPerson({ req, res }));

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));