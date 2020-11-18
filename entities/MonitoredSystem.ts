
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { MonitoredDatabase } from './MonitoredDatabase';
import { MonitoredWebService } from './MonitoredWebService';
import { MonitoredWebsite } from './MonitoredWebsite';
import { MonitorSystemsErrors } from './MonitorSystemsErrors';


@Entity()
export class MonitoredSystem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    systemName: string;

    @Column("datetime", { nullable: true })
    upDate: Date;

    @OneToMany(() => MonitoredWebsite, monitoredWebsites => monitoredWebsites.system)
    websites: MonitoredWebsite[];

    @OneToMany(() => MonitoredDatabase, monitoredDatabase => monitoredDatabase.system)
    databases: MonitoredDatabase[];

    @OneToMany(() => MonitoredWebService, monitoredWebService => monitoredWebService.system)
    webservices: MonitoredWebService[];

    @OneToMany(() => MonitorSystemsErrors, monitoredErrorsSystems => monitoredErrorsSystems.system)
    errors: MonitorSystemsErrors[];

}