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
    responseType: string;
    property: string;
    propertyDataType: string;
    isOkValue: string;
    isDownValue: string;
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
    errors: IMonitoredSystemsErrors[]
}

export interface IMonitoredSystemsErrors {
    id: number;
    description: string;
    timestamp: string | Date;
    systemId: number;
    errorId: number;
}

export interface IMonitorConfiguration {
    timeInterval: number;
}