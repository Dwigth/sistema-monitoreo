import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class MonitorGlobalConfiguration {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'boolean' })
    enableNotifications: boolean;

    @Column({ type: 'varchar' })
    emailAccount: string;
    
    @Column({ type: 'varchar' })
    passwordAccount: string;
    
    @Column({ type: 'int' })
    maxConnections: number;
    
    @Column({ type: 'varchar' })
    host: string;
    
    @Column({ type: 'int' })
    port: number;
}