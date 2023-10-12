import { IMonitoredApplication } from './interfaces/core';

export class Systems {
    constructor() { }

    get Systems(): IMonitoredApplication[] {
        let localdata = localStorage.getItem('systems');
        if (localdata === null) { return [] as IMonitoredApplication[]; }
        else { return Array.from(JSON.parse(localStorage.getItem('systems'))) }
    }

    set newSystems(data) {
        localStorage.setItem('systems', JSON.stringify(data))
    }
}