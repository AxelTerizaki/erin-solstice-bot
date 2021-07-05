import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import DailyUser from './dailyUsers';

@Entity()
export default class Daily {
    /**
     * Type of daily
     */
    @PrimaryColumn()
    type: string;

    /**
     * Base amount at 100%
     */
    @Column()
    amount: number;

    /**
     * Regress multiplier by person
     */
    @Column({
    	default: 0.25,
    	type: 'numeric'
    })
    regress = 0.25;

    /**
     * Base multiplier for first call, will regress of <regress> by person til 1.00
     */
    @Column({
    	default: 2.00,
    	type: 'numeric'
    })
    firstcall = 2.00;

    @OneToMany(() => DailyUser, dailyuser => dailyuser.daily)
    users: DailyUser[]
}