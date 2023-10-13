import { MonitorConfiguration } from './entities/MonitorConfiguration';
import { MonitoredDatabase } from './entities/MonitoredDatabase';
import { MonitoredSystem } from './entities/MonitoredSystem';
import { MonitoredWebService } from './entities/MonitoredWebService';
import { MonitoredWebsite } from './entities/MonitoredWebsite';
import { MonitorSystemsErrors } from './entities/MonitorSystemsErrors';
import { MonitorErrorsCatalog } from './entities/MonitorErrorsCatalog';
import * as config from './data.json';
import { AppDataSource } from './data-source';

export class StartSequence {

    async InsertAll() {

        // Insertamos primero la configuración
        if (config.MonitorConfiguration.length > 0) {
            Array.from(config.MonitorConfiguration).forEach(async (_config: any) => {
                const MonitorConfig = new MonitorConfiguration();
                MonitorConfig.activated = _config.activated;
                MonitorConfig.label = _config.label;
                MonitorConfig.timeInterval = _config.timeInterval;
                await AppDataSource.getRepository(MonitorConfiguration).save(MonitorConfig);
                console.log('Insertando configuraciones');
            });
        }

        // Despues insertamos el catálogo de errores
        if (config.ErrorsCatalog.length > 0) {
            Array.from(config.ErrorsCatalog).forEach(async (_errorCatalog: any) => {
                const monitorErrorsCatalog = new MonitorErrorsCatalog();
                monitorErrorsCatalog.code = _errorCatalog.code;
                monitorErrorsCatalog.description = _errorCatalog.description;
                await AppDataSource.getRepository(MonitorErrorsCatalog).save(monitorErrorsCatalog);
                console.log('Insertando catalogo de errores');

            });
        }

        if (config.Systems.length > 0) {
            Array.from(config.Systems).forEach(async (_system: any) => {
                let system = new MonitoredSystem();
                system.upDate = new Date();
                system.systemName = _system.systemName;
                const savedSystem = await AppDataSource.getRepository(MonitoredSystem).save(system);
                console.log('Insertando sistema: ', savedSystem.systemName);

                Array.from(_system.websites).forEach(async (_website: any) => {
                    if (_website) {
                        const website = new MonitoredWebsite();
                        website.name = _website.name;
                        website.url = _website.url;
                        website.statusResponseCode = _website.statusResponseCode;
                        website.system = savedSystem;
                        await AppDataSource.getRepository(MonitoredWebsite).save(website);
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
                        await AppDataSource.getRepository(MonitoredWebService).save(webservice);
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
                        await AppDataSource.getRepository(MonitoredDatabase).save(database);
                        console.log('Insertando base de datos');
                    }
                });

            })
        }
    }

    async DeleteAll() {
        console.log('Borramos configuraciones');
        // Borramos todo
        const configs = await AppDataSource.getRepository(MonitorConfiguration).find();
        configs.forEach(async (mc) => await AppDataSource.getRepository(MonitorConfiguration).remove(mc));

        console.log('Borramos bases de datos');
        const databases = await AppDataSource.getRepository(MonitoredDatabase).find();
        databases.forEach(async (mc) => await AppDataSource.getRepository(MonitoredDatabase).remove(mc));

        console.log('Borramos bases de servicios webs');
        const webservices = await AppDataSource.getRepository(MonitoredWebService).find();
        webservices.forEach(async (mc) => await AppDataSource.getRepository(MonitoredWebService).remove(mc));

        console.log('Borramos sitios web');
        const websites = await AppDataSource.getRepository(MonitoredWebsite).find();
        websites.forEach(async (mc) => await AppDataSource.getRepository(MonitoredWebsite).remove(mc));

        console.log('Borramos sistemas');
        const systems = await AppDataSource.getRepository(MonitoredWebsite).find();
        systems.forEach(async (mc) => await AppDataSource.getRepository(MonitoredWebsite).remove(mc));

        console.log('Borramos errores')


        const systemErrors = await AppDataSource.getRepository(MonitorSystemsErrors).find();
        systemErrors.forEach(async (mc) => await AppDataSource.getRepository(MonitorSystemsErrors).remove(mc));

        const errorCatalog = await AppDataSource.getRepository(MonitorErrorsCatalog).find();
        errorCatalog.forEach(async (mc) => await AppDataSource.getRepository(MonitorErrorsCatalog).remove(mc));
    }

}