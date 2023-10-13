import * as cors from "cors";
import * as express from "express";
import { createServer } from 'http';
import * as socketio from 'socket.io';
import { attachPerson, getSystems, resolveIssue } from "./operations/systems";
import * as ViteExpress from "vite-express";
import { main } from "./main";
import { getConfig } from "./utils/get-config";
import { StartSequence } from "./start-sequence";
import { AppDataSource } from "./data-source";

const app = express();
const http = createServer(app);
const io = new socketio.Server(http);

const initSequence = async () => {
    let config = await getConfig();
    if (config == null) {
        try {
            const sequence = new StartSequence();
            await sequence.InsertAll();
            config = await getConfig();
        } catch (error) {
            console.error('Error de secuencia', error)
        }
    }
}
Promise.resolve(AppDataSource.initialize()).then(async connection => {
    await initSequence()
    main(io, connection);
})


// Middlewares
app.use(cors())
app.use(express.json())

// Servir la aplicacion
//app.use('/', express.static(__dirname.replace('server', 'monitoreo')));

// Rutas 
app.delete('/resolve/issue/:id', async (req, res) => resolveIssue({ req, res }));

app.get('/systems/all', async (req, res) => getSystems(res));

app.post('/systems/attach/person-to-system', async (req, res) => attachPerson({ req, res }));

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));