import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class EventMessage {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    type?: number;

    @Column()
    message?: string;


}
