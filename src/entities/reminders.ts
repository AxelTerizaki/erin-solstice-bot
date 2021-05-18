import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Reminder {
    @PrimaryGeneratedColumn()
    id?: number;

	@Column()
	user_id?: string;

	@Column()
	name?: string;

    @Column()
    content?: string;

	@CreateDateColumn()
    created_at?: Date;

	@Column()
    remind_at?: Date;

	@Column()
	channel_id?: string;
}