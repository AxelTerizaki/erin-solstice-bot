import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    emote: string;

    @Column()
    price: number;
}