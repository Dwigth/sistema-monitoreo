/**
 * ================================================
 * 
 *  Importaciones globales
 * 
 * ================================================
 */
import { MonitorAlarmPeople } from "./entities/MonitorAlarmPeople";
import { MonitoredDatabase } from "./entities/MonitoredDatabase";
import { MonitoredSystem } from "./entities/MonitoredSystem";
import { MonitoredWebService } from "./entities/MonitoredWebService";
import { MonitoredWebsite } from "./entities/MonitoredWebsite";
import { MonitorGlobalConfiguration } from "./entities/MonitorGlobalConfiguration";
import { MonitorSystemsErrors } from "./entities/MonitorSystemsErrors";
import { getRepository, getManager } from "typeorm";
import { Application } from "express";

export const REST = (app: Application) => {

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
            res.json({ error: true, msg: `Ya existe un sistema con el nombre "${systemName}"` })
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
    if (id) {
        const system = await getRepository(MonitoredSystem).findOne({ where: { id: id } });
        if (system) {
            const databases = await getRepository(MonitoredDatabase).find({ where: { system: system } })
            res.json({ error: false, msg: '', data: databases })
        } else {
            res.json({ error: true, msg: 'No se encontró un sistema asociado con este ID.' })
        }
    } else {
        const databases = await getRepository(MonitoredDatabase).find()
        res.json({ error: false, msg: '', data: databases })
    }
})

app.get('/systems/websites', async (req, res) => {
    const id = parseInt(req.query["systemId"].toString())
    if (id) {
        const system = await getRepository(MonitoredSystem).findOne({ where: { id: id } });
        if (system) {
            const websites = await getRepository(MonitoredWebsite).find({ where: { system: system } })
            res.json({ error: false, msg: '', data: websites })
        } else {
            res.json({ error: true, msg: 'No se encontró un sistema asociado con este ID.' })
        }
    } else {
        const websites = await getRepository(MonitoredWebsite).find()
        res.json({ error: false, msg: '', data: websites })
    }
})

app.get('/systems/webservices', async (req, res) => {
    const id = parseInt(req.query["systemId"].toString())
    if (id) {
        const system = await getRepository(MonitoredSystem).findOne({ where: { id: id } });
        if (system) {
            const ws = await getRepository(MonitoredWebService).find({ where: { system: system } })
            res.json({ error: false, msg: '', data: ws })
        } else {
            res.json({ error: true, msg: 'No se encontró un sistema asociado con este ID.' })
        }
    } else {
        const ws = await getRepository(MonitoredWebService).find()
        res.json({ error: false, msg: '', data: ws })
    }
})

app.get('/system/configs', async (req, res) => {
    const globalConfig = await getRepository(MonitorGlobalConfiguration).findOne();
    res.json({ error: false, msg: '', data: globalConfig })
})

app.post('/system/edit/notifications', async (req, res) => {
    const saveToDB = req.body.savePasswordOnDB;
    const data = <MonitorGlobalConfiguration>req.body;
    let globalConfig = await getRepository(MonitorGlobalConfiguration).findOne();
    try {
        globalConfig.enableNotifications = data.enableNotifications;
        globalConfig.emailAccount = data.emailAccount;
        globalConfig.host = data.host;
        globalConfig.maxConnections = data.maxConnections;
        if (saveToDB) {
            globalConfig.passwordAccount = data.passwordAccount;
        }else {
            console.log('Guardar la contraseña en un .env...');
            // TODO guardar en .env
        }
        globalConfig.port = data.port;
        await getManager().save(globalConfig);
        res.json({ error: false, msg: 'Se ha guardado la configuración.' })
    } catch (error) {
        res.json({ error: true, msg: 'Error', data: error })
    }

});

}