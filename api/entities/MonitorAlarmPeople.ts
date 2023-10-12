import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { MonitoredSystem } from './MonitoredSystem';

@Entity()
export class MonitorAlarmPeople {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @ManyToOne(() => MonitoredSystem, monitoredSystem => monitoredSystem.alarmPeople)
    system: MonitoredSystem;
}