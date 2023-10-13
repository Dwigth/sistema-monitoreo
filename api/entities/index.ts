import { MonitorAlarmPeople } from "./MonitorAlarmPeople";
import { MonitorConfiguration } from "./MonitorConfiguration";
import { MonitorErrorsCatalog } from "./MonitorErrorsCatalog";
import { MonitorSystemsErrors } from "./MonitorSystemsErrors";
import { MonitoredDatabase } from "./MonitoredDatabase";
import { MonitoredSystem } from "./MonitoredSystem";
import { MonitorSystemsErrorsHistory } from "./MonitoredSystemsErrorsHistory";
import { MonitoredWebService } from "./MonitoredWebService";
import { MonitoredWebsite } from "./MonitoredWebsite";

export default [
    MonitorAlarmPeople,
    MonitorConfiguration,
    MonitoredDatabase,
    MonitoredSystem,
    MonitorSystemsErrorsHistory,
    MonitoredWebService,
    MonitoredWebsite,
    MonitorErrorsCatalog,
    MonitorSystemsErrors,
]