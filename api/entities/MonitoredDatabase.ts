import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";
import { MonitoredSystem } from './MonitoredSystem';

@Entity()
export class MonitoredDatabase {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column({ unique: true })
    name: string;

    @Column()
    host: string;

    @Column()
    port: number;

    @Column()
    username: string;

    @Column({ nullable: true })
    sid: string;

    @Column()
    password: string;

    @Column()
    label: string;

    @Column()
    databaseName: string;

    @Column()
    statusResponseCode: number;

    @ManyToOne(() => MonitoredSystem, monitoredSystem => monitoredSystem.databases)
    system: MonitoredSystem;

}