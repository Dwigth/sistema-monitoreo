import { MonitorConfiguration } from './entities/MonitorConfiguration';
import { MonitoredDatabase } from './entities/MonitoredDatabase';
import { MonitoredSystem } from './entities/MonitoredSystem';
import { MonitoredWebService } from './entities/MonitoredWebService';
import { MonitoredWebsite } from './entities/MonitoredWebsite';
import { getManager } from "typeorm";
import { createConnection } from 'typeorm';
//@ts-ignore
import * as config from './data.json';

class StartSequence {

    constructor() {
        createConnection().then(async connection => {
            await this.DeleteAll();
            await this.InsertAll();
        });
    }

    async InsertAll() {

        // Insertamos primero la configuración
        if (config.MonitorConfiguration.length > 0) {
            Array.from(config.MonitorConfiguration).forEach(async (_config: any) => {
                const MonitorConfig = new MonitorConfiguration();
                MonitorConfig.activated = _config.activated;
                MonitorConfig.label = _config.label;
                MonitorConfig.timeInterval = _config.timeInterval;
                await getManager().save(MonitorConfig);
                console.log('Insertando configuraciones');

            });
        }

        if (config.Systems.length > 0) {
            Array.from(config.Systems).forEach(async (_system: any) => {
                let system = new MonitoredSystem();
                system.upDate = new Date();
                system.systemName = _system.systemName;
                const savedSystem = await getManager().save(system);
                console.log('Insertando sistema: ', savedSystem.systemName);

                Array.from(_system.websites).forEach(async (_website: any) => {
                    if (_website) {
                        const website = new MonitoredWebsite();
                        website.name = _website.name;
                        website.url = _website.url;
                        website.statusResponseCode = _website.statusResponseCode;
                        website.system = savedSystem;
                        await getManager().save(website);
                        console.log('Insertando sitio web');
                    }
                });
                Array.from(_system.webservices).forEach(async (_webservice: any) => {
                    if (_webservice) {
                        const webservice = new MonitoredWebService();
                        webservice.isDownValue = _webservice.isDownValue;
                        webservice.isOkValue = _webservice.isOkValue;
                        webservice.name = _webservice.name;
                        webservice.property = _webservice.property;
                        webservice.propertyDataType = _webservice.propertyDataType;
                        webservice.responseType = _webservice.responseType;
                        webservice.statusResponseCode = _webservice.statusResponseCode;
                        webservice.token = _webservice.token;
                        webservice.url = _webservice.url;
                        webservice.system = savedSystem;
                        await getManager().save(webservice);
                        console.log('Insertando servicio web');
                    }
                });
                Array.from(_system.databases).forEach(async (_databases: any) => {
                    if (_databases) {
                        const database = new MonitoredDatabase();
                        database.databaseName = _databases.databaseName;
                        database.host = _databases.host;
                        database.label = _databases.label;
                        database.name = _databases.name;
                        database.password = _databases.password;
                        database.port = _databases.port;
                        database.sid = _databases.sid;
                        database.statusResponseCode = _databases.statusResponseCode;
                        database.type = _databases.type;
                        database.username = _databases.username;
                        database.system = savedSystem;
                        await getManager().save(database);
                        console.log('Insertando base de datos');
                    }
                });

            })
        }
    }

    async DeleteAll() {
        console.log('Borramos configuraciones');
        // Borramos todo
        const configs = await getManager().find(MonitorConfiguration);
        configs.forEach(async (mc) => await getManager().remove(mc));

        console.log('Borramos bases de datos');
        const databases = await getManager().find(MonitoredDatabase);
        databases.forEach(async (mc) => await getManager().remove(mc));

        console.log('Borramos bases de servicios webs');
        const webservices = await getManager().find(MonitoredWebService);
        webservices.forEach(async (mc) => await getManager().remove(mc));

        console.log('Borramos sitios web');
        const websites = await getManager().find(MonitoredWebsite);
        websites.forEach(async (mc) => await getManager().remove(mc));

        console.log('Borramos sistemas');
        const systems = await getManager().find(MonitoredSystem);
        systems.forEach(async (mc) => await getManager().remove(mc));
    }

}

new StartSequence();