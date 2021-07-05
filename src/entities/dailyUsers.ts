import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import Daily from './dailies';

@Entity()
export default class DailyUser {
    /**
     * In fact, should be user with FK but:
     * @see https://github.com/typeorm/typeorm/issues/3952
     */
    @PrimaryColumn()
    userid: string;

    @ManyToOne(() => Daily, daily => daily.users)
    @JoinColumn()
    daily: Daily;

    @Column()
    @CreateDateColumn()
    @UpdateDateColumn()
    date: Date;
}