export interface IMonitoredWebsite {
    id: number;
    url: string;
    name: string;
    statusResponseCode: number;
}

export interface IMonitoredDatabase {
    id: number;
    url: string;
    port: number;
    name: string;
    label: string;
    statusResponseCode: number;
}

export interface IMonitoredApplication {
    id: number;
    website: IMonitoredWebsite[];
    database: IMonitoredDatabase[];
}

export interface IMonitorConfiguration {
    timeInterval: number;
}