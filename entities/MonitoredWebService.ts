import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";
import { MonitoredSystem } from './MonitoredSystem';

@Entity()
export class MonitoredWebService {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    name: string;
    @Column({ nullable: true })
    token: string;

    @Column()
    statusResponseCode: number;

    @ManyToOne(() => MonitoredSystem, monitoredSystem => monitoredSystem.webservices)
    system: MonitoredSystem;

}