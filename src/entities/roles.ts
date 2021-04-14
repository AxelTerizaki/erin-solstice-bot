import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class Role {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({
    	default: false,
    	type: 'boolean'
    })
    assignable = false;
}