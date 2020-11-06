
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, JoinColumn, OneToOne, OneToMany } from "typeorm";
import { MonitoredDatabase } from './MonitoredDatabase';
import { MonitoredWebService } from './MonitoredWebService';
import { MonitoredWebsite } from './MonitoredWebsite';


@Entity()
export class MonitoredSystem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    systemName: string;

    @OneToMany(() => MonitoredWebsite, monitoredWebsites => monitoredWebsites.system)
    websites: MonitoredWebsite[];

    @OneToMany(() => MonitoredDatabase, monitoredDatabase => monitoredDatabase.system)
    databases: MonitoredDatabase[];

    @OneToMany(() => MonitoredWebService, monitoredWebService => monitoredWebService.system)
    webservices: MonitoredDatabase[];

}