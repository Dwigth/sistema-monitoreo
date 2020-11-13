export interface IMonitoredWebsite {
    id: number;
    url: string;
    name: string;
    statusResponseCode: number;
}

export interface IMonitoredWebservice {
    id: number;
    url: string;
    name: string;
    token?: string;
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
    systemName: string;
    upDate: string;
    websites: IMonitoredWebsite[];
    databases: IMonitoredDatabase[];
    webservices: IMonitoredWebservice[];
}

export interface IMonitorConfiguration {
    timeInterval: number;
}