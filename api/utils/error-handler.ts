import moment from "moment";
import { AppDataSource } from "../data-source";
import { AlertMail } from "../email";
import { MonitorErrorsCatalog } from "../entities/MonitorErrorsCatalog";
import { MonitorSystemsErrors } from "../entities/MonitorSystemsErrors";
import { MonitoredSystem } from "../entities/MonitoredSystem";
import { MonitorSystemsErrorsHistory } from "../entities/MonitoredSystemsErrorsHistory";
import { ErrorMsg } from "./error-message";

export async function ErrorHandler(system: MonitoredSystem, statusCode: number, type?: string, msg?: string) {
    if (statusCode >= 201) {

        const errorCat = await AppDataSource.getRepository(MonitorErrorsCatalog).findOne({ where: { code: statusCode } });
        if (errorCat) {
            const latestError = await AppDataSource.getRepository(MonitorSystemsErrors).findOne({ where: { system: system, error: errorCat } });
            if (latestError === undefined) {
                try {
                    const systemError = new MonitorSystemsErrors();
                    let SystemErrorHistory = new MonitorSystemsErrorsHistory();

                    systemError.error = errorCat;
                    systemError.system = system;
                    systemError.timestamp = new Date();
                    systemError.description = (msg != undefined) ? msg : ErrorMsg(type, errorCat.description);

                    SystemErrorHistory.error = errorCat;
                    SystemErrorHistory.system = system;
                    SystemErrorHistory.timestamp = new Date();
                    SystemErrorHistory.description = (msg != undefined) ? msg : ErrorMsg(type, errorCat.description);
                    await AppDataSource.getRepository(MonitorSystemsErrors).save(systemError);
                    await AppDataSource.getRepository(MonitorSystemsErrorsHistory).save(SystemErrorHistory);
                    const alertEmail = new AlertMail();
                    alertEmail.CurrentSystem = system;
                    await alertEmail.SendEmail();
                } catch (error) {
                    console.log(error);

                }
            } else {
                console.log('El error persiste');
            }
        }
    } else {
        console.log(`[Verificando si hay errores en este sistema][${system.systemName}]`, moment().utc(true).format('YYYY-MM-DD HH:mm:ss'));
        const lastErrors = await AppDataSource.getRepository(MonitorSystemsErrors).find({ where: { system: system } });
        if (lastErrors.length > 0) {
            console.log('Se encontraron errores en este sistema... Procediendo a eliminarlos.', moment().utc(true).format('YYYY-MM-DD HH:mm:ss'));
            console.log(lastErrors);
            lastErrors.forEach(error => AppDataSource.getRepository(MonitorSystemsErrors).remove(error));
        }
    }
}