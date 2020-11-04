export interface IMonitoredWebsite {
    url: string;
    name: string;
    statusResponseCode: number;
}

export interface IMonitoredDatabase {
    url: string;
    port: number;
    name: string;
    label: string;
    statusResponseCode: number;
}

export interface IMonitoredApplication {
    website: IMonitoredWebsite;
    database: IMonitoredDatabase;
}

export interface IMonitorConfiguration {
    timeInterval: number;
}