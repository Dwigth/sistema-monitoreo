import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { MonitorSystemsErrors } from './MonitorSystemsErrors';

@Entity()
export class MonitorErrorsCatalog {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: number;

    @Column()
    description: string;

    @OneToMany(() => MonitorSystemsErrors, MonitorSystemsErrors => MonitorSystemsErrors.error)
    systemErrors: MonitorSystemsErrors[];
}