import { Response } from "express";
import { AppDataSource } from "../data-source";
import { MonitoredSystem } from "../entities/MonitoredSystem";
import { MonitorAlarmPeople } from "../entities/MonitorAlarmPeople";
import { MonitorSystemsErrors } from "../entities/MonitorSystemsErrors";

export const getSystems = async (res: Response) => {
    const systems = await AppDataSource.getRepository(MonitoredSystem).find({ relations: ['websites', 'databases', 'webservices', 'errors', 'alarmPeople'] })
    res.json(systems);
}

export const attachPerson = async ({ req, res }) => {
    const people = req.body.people;
    if (people && Array.isArray(people) && people.length > 0) {
        const responses = people.map(async person => {
            const systemId = person.systemId;
            const email = person.email;
            const name = person.name;
            if ([systemId, email, name].includes(undefined) === false) {
                const system = await AppDataSource.getRepository(MonitoredSystem).findOne({ where: { id: systemId } });
                if (system) {
                    const personToAttach = new MonitorAlarmPeople();
                    personToAttach.email = email;
                    personToAttach.name = name;
                    personToAttach.system = system;
                    const alreadyExist = await AppDataSource.getRepository(MonitorAlarmPeople).findOne({ where: { email: personToAttach.email, system: system } });
                    if (alreadyExist) {
                        return 'Este correo ya está asociado a este sistema.';
                    } else {
                        return await AppDataSource.getRepository(MonitorAlarmPeople).save(personToAttach).then(() =>
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
}

export const resolveIssue = async ({ req, res }) => {
    const id = req.params.id;
    const error = await AppDataSource.getRepository(MonitorSystemsErrors).findOne({ where: { id: Number(id) } });
    if (error) {
        const deleted = await AppDataSource.getRepository(MonitorSystemsErrors).remove(error);
        if (deleted) {
            res.json({ error: false, msg: `Se ha resuelto el error ${error.description}` })
        } else {
            res.json({ error: true, msg: 'Ocurrió un error durante la ejecución.', info: deleted })
        }
    } else {
        res.json({ error: true, msg: 'No se encontró el error del sistema.' })
    }
}