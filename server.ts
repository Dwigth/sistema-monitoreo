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
import * as xml from 'xml-js';
import * as moment from 'moment';
import { AlertMail } from './email';
const objgrep = require('object-grep');

/**
 * ================================================
 * 
 *  Importaciones de base de datos
 * 
 * ================================================
 */
import { ConnectionManager, createConnection, getManager, getRepository } from 'typeorm';
import { MonitoredSystem, } from './entities/MonitoredSystem';
import { MonitorConfiguration } from './entities/MonitorConfiguration';
import { MonitorErrorsCatalog } from './entities/MonitorErrorsCatalog';
import { MonitorSystemsErrors } from './entities/MonitorSystemsErrors';
import { MonitoredWebService } from './entities/MonitoredWebService';
import { MonitorSystemsErrorsHistory } from './entities/MonitoredSystemsErrorsHistory';
import { MonitorAlarmPeople } from './entities/MonitorAlarmPeople';
import { MonitorGlobalConfiguration } from './entities/MonitorGlobalConfiguration';
import { MonitoredDatabase } from './entities/MonitoredDatabase';
import { MonitoredWebsite } from './entities/MonitoredWebsite';

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
    app.delete('/resolve/issue/:id', async (req, res) => {
        const id = req.params.id;
        const error = await getRepository(MonitorSystemsErrors).findOne({ where: { id: id } });
        if (error) {
            const deleted = await getRepository(MonitorSystemsErrors).remove(error);
            if (deleted) {
                res.json({ error: false, msg: `Se ha resuelto el error ${error.description}` })
            } else {
                res.json({ error: true, msg: 'Ocurrió un error durante la ejecución.', info: deleted })
            }
        } else {
            res.json({ error: true, msg: 'No se encontró el error del sistema.' })
        }
    });

    app.get('/systems/all', async (req, res) => {
        const systems = await getRepository(MonitoredSystem).find({ relations: ['websites', 'databases', 'webservices', 'errors', 'alarmPeople'] })
        res.json(systems);
    });

    app.post('/systems/attach/person-to-system', async (req, res) => {
        const people = req.body.people;
        if (people && Array.isArray(people) && people.length > 0) {
            const responses = people.map(async person => {
                const systemId = person.systemId;
                const email = person.email;
                const name = person.name;
                if ([systemId, email, name].includes(undefined) === false) {
                    const system = await getRepository(MonitoredSystem).findOne({ where: { id: systemId } });
                    if (system) {
                        const personToAttach = new MonitorAlarmPeople();
                        personToAttach.email = email;
                        personToAttach.name = name;
                        personToAttach.system = system;
                        const alreadyExist = await getRepository(MonitorAlarmPeople).findOne({ where: { email: personToAttach.email, system: system } });
                        if (alreadyExist) {
                            return 'Este correo ya está asociado a este sistema.';
                        } else {
                            return await getRepository(MonitorAlarmPeople).save(personToAttach).then(() =>
                                `Se ha registrado a ${personToAttach.name} con el correo ${personToAttach.email} al sistema ${personToAttach.system.systemName}`
                            ).catch(e => e);
                        }
                    } else {
                        return 'No se encontró el sistema.';
                    }
                } else {
                    return 'Debe enviar todos los parametros.';
                }
            })
            // Respuesta
            res.json(await Promise.all(responses));
        } else {
            res.json('No se envió el parametro de manera correcta.')
        }
    });

    app.post('/systems/add', async (req, res) => {
        let systemName = req.body.systemName;
        if (systemName) {
            systemName = systemName.trim();
            const exists = await getRepository(MonitoredSystem).findOne({ where: { systemName: systemName } })
            if (exists) {
            res.json({ error: true, msg: `Ya existe un sistema con el nombre "${systemName}"`  })
            } else {
                const system = new MonitoredSystem();
                system.systemName = systemName;
                system.upDate = new Date();
                await getManager().save(system);
                res.json({ error: false, msg: 'Se ha guardado el sistema.' })
            }
        } else {
            res.json({ error: true, msg: 'No se ha enviado ningun dato.' })
        }
    });

    app.get('/systems/databases', async (req, res) => {
        const id = parseInt(req.query["systemId"].toString())
        if(id) {
            const system = await getRepository(MonitoredSystem).findOne({where:{id:id}});
            if(system) {
                const databases = await getRepository(MonitoredDatabase).find({where:{system:system}})
                res.json({error:false,msg:'',data:databases})
            }else {
                res.json({error:true,msg:'No se encontró un sistema asociado con este ID.'})
            }
        } else {
            const databases = await getRepository(MonitoredDatabase).find()
            res.json({error:false,msg:'',data:databases})
        }
    })
    app.get('/systems/websites', async (req, res) => {
        const id = parseInt(req.query["systemId"].toString())
        if(id) {
            const system = await getRepository(MonitoredSystem).findOne({where:{id:id}});
            if(system) {
                const websites = await getRepository(MonitoredWebsite).find({where:{system:system}})
                res.json({error:false,msg:'',data:websites})
            }else {
                res.json({error:true,msg:'No se encontró un sistema asociado con este ID.'})
            }
        } else {
            const websites = await getRepository(MonitoredWebsite).find()
            res.json({error:false,msg:'',data:websites})
        }
    })
    app.get('/systems/webservices', async (req, res) => {
        const id = parseInt(req.query["systemId"].toString())
        if(id) {
            const system = await getRepository(MonitoredSystem).findOne({where:{id:id}});
            if(system) {
                const ws = await getRepository(MonitoredWebService).find({where:{system:system}})
                res.json({error:false,msg:'',data:ws})
            }else {
                res.json({error:true,msg:'No se encontró un sistema asociado con este ID.'})
            }
        } else {
            const ws = await getRepository(MonitoredWebService).find()
            res.json({error:false,msg:'',data:ws})
        }
    })
    app.get('/system/configs', async (req, res) => {
        
    })
    app.post('/system/edit/notifications', async (req, res) => {

    });

    http.listen(3009, () => {
        console.log('listening on *:3009');
    });

    // dash.monitor({ server: http });

}).catch(error => console.log(error));

// Error Handling, etc...

const ErrorMsg = (name, description) => `${name} ha sufrido un error del tipo: ${description}`;
const WebServiceErrorMsg = (wsname, val, expectedValue) => 'Ha ocurrido un error con ' + wsname + `. Valor recibido: ${val}, Valor esperado: ${expectedValue}`;

async function ErrorHandler(system: MonitoredSystem, statusCode: number, type?: string, msg?: string) {
    if (statusCode >= 201) {
        const globalConfiguration = await getRepository(MonitorGlobalConfiguration).findOne();
        const errorCat = await getRepository(MonitorErrorsCatalog).findOne({ where: { code: statusCode } });
        if (errorCat) {
            const latestError = await getRepository(MonitorSystemsErrors).findOne({ where: { system: system, error: errorCat } });
            if (latestError === undefined) {
                try {
                    const systemError = new MonitorSystemsErrors();
                    let SystemErrorHistory = new MonitorSystemsErrorsHistory();

                    systemError.error = errorCat;
                    systemError.system = system;
                    systemError.timestamp = new Date();
                    systemError.description = (msg != undefined) ? msg : ErrorMsg(type, errorCat.description);

                    SystemErrorHistory.error = errorCat;
                    SystemErrorHistory.system = system;
                    SystemErrorHistory.timestamp = new Date();
                    SystemErrorHistory.description = (msg != undefined) ? msg : ErrorMsg(type, errorCat.description);
                    await getManager().save(systemError);
                    await getManager().save(SystemErrorHistory);
                    if (globalConfiguration.enableNotifications) {
                        const alertEmail = new AlertMail();
                        alertEmail.CurrentSystem = system;
                        await alertEmail.SendEmail();
                    } else {
                        console.error(new Error('Las notificaciones no están activadas.'))
                    }
                } catch (error) {
                    console.log(error);

                }
            } else {
                console.log('El error persiste');
            }
        }
    } else {
        console.log(`[Verificando si hay errores en este sistema][${system.systemName}]`, moment().utc(true).format('YYYY-MM-DD HH:mm:ss'));
        const lastErrors = await getRepository(MonitorSystemsErrors).find({ where: { system: system } });
        if (lastErrors.length > 0) {
            console.log('Se encontraron errores en este sistema... Procediendo a eliminarlos.', moment().utc(true).format('YYYY-MM-DD HH:mm:ss'));
            console.log(lastErrors);
            lastErrors.forEach(error => getRepository(MonitorSystemsErrors).remove(error));
        }
    }
}
/**
 * 
 */
async function AnalizingWebServiceContent(ws: MonitoredWebService, response: string) {
    let type = '';
    switch (ws.responseType) {
        case 'string':
            response = response.trim();
            if (response.indexOf(ws.isOkValue) < 0 || response === '') {
                ErrorHandler(ws.system, 206, `El servicio web "${ws.name}"`, WebServiceErrorMsg(ws.name, response, ws.isOkValue));
                console.log('Ha ocurrido un error con ', ws.name);
                return;
            }
            // console.log('Todo está bien.');
            break;
        case 'json':
            response = JSON.parse(JSON.stringify(response));
            const val = response[ws.property];
            let expectedValue = '';
            if (['number', 'boolean'].includes(ws.propertyDataType)) {
                expectedValue = JSON.parse(ws.isOkValue);
            } else {
                // Es un string
                expectedValue = ws.isOkValue;
            }
            // console.log(val, expectedValue);

            // console.log(response, ws.property, typeof val, typeof JSON.parse(ws.isOkValue));
            if (val !== expectedValue || val === '') {
                ErrorHandler(ws.system, 206, `El servicio web "${ws.name}"`, WebServiceErrorMsg(ws.name, val, ws.isOkValue));
                console.log('Ha ocurrido un error con ' + ws.name, `Valor recibido: ${val}, Valor esperado: ${expectedValue}`);
                return;
            }
            // console.log('Todo está bien');
            break;
        case 'xml':
            const result = xml.xml2js(response, { compact: true });
            try {
                let r = objgrep.objectGrep(result, ws.isOkValue);
                if (r === {}) {
                    ErrorHandler(ws.system, 204, ws.name, WebServiceErrorMsg(ws.name, response, ws.isOkValue))
                    console.log('Ha ocurrido un error con ' + ws.name);
                }
            } catch (error) {
                console.log(error);
            }

            break;
        default:
            break;
    }
}