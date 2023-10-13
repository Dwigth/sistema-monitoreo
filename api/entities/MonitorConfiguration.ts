import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class MonitorConfiguration {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    timeInterval: number;

    @Column({ unique: true })
    label: string;

    @Column({ type: 'boolean' })
    activated: boolean;

}