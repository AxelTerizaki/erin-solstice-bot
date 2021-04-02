import {Column,Entity, PrimaryColumn} from 'typeorm';

@Entity()
export default class Setting {

    @PrimaryColumn()
    setting: string;

    @Column()
    value: string;

}