import { AppDataSource } from "../data-source";
import { MonitorConfiguration } from "../entities/MonitorConfiguration";

export const getConfig = async () => {
    return await AppDataSource.getRepository(MonitorConfiguration).findOne({ where: { activated: true } });
}