import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, JoinColumn, OneToOne, OneToMany } from "typeorm";
import { MonitorSystemsErrors } from './MonitorSystemsErrors';

@Entity()
export class MonitorErrorsCatalog {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: number;

    @Column()
    description: string;

    @OneToMany(() => MonitorSystemsErrors, MonitorSystemsErrors => MonitorSystemsErrors.error)
    systemErrors: MonitorSystemsErrors[];
}