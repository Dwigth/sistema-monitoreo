import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";
import { MonitoredSystem } from './MonitoredSystem';

@Entity()
export class MonitoredDatabase {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    name: string;

    @Column()
    label: string;

    @Column()
    port: number;

    @Column()
    statusResponseCode: number;

    @ManyToOne(() => MonitoredSystem, monitoredSystem => monitoredSystem.databases)
    system: MonitoredSystem;

}