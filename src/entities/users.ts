import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import Inventory from './inventories';

@Entity()
export default class User {
    @PrimaryColumn()
    id: string;

    @Column()
    money: number;

    @OneToMany(() => Inventory, inv => inv.user)
    inventory: Inventory[];
}