import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";
import { MonitoredSystem } from './MonitoredSystem';
import { MonitorErrorsCatalog } from './MonitorErrorsCatalog';

@Entity()
export class MonitorSystemsErrors {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @ManyToOne(() => MonitoredSystem, monitoredSystem => monitoredSystem.errors)
    system: MonitoredSystem;

    @ManyToOne(() => MonitoredSystem, monitoredSystem => monitoredSystem.errors)
    error: MonitorErrorsCatalog;

}