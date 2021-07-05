import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import Item from './items';
import User from './users';

@Entity()
export default class Inventory {
    @ManyToOne(() => User, user => user.inventory, { primary: true, cascade: true })
    @JoinColumn()
    user: User;

    @ManyToOne(() => Item, { primary: true, cascade: true })
    @JoinColumn()
    item: Item;

    @Column()
    nb: number;
}