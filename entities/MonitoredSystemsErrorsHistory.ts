import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { MonitoredSystem } from './MonitoredSystem';
import { MonitoredWebService } from './MonitoredWebService';
import { MonitorErrorsCatalog } from './MonitorErrorsCatalog';

@Entity()
export class MonitorSystemsErrorsHistory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column('datetime')
    timestamp: Date;

    @ManyToOne(() => MonitoredSystem, monitoredSystem => monitoredSystem.errors)
    system: MonitoredSystem;

    @ManyToOne(() => MonitorErrorsCatalog, MonitorErrorsCatalog => MonitorErrorsCatalog.systemErrors)
    error: MonitorErrorsCatalog;

}