import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class UserLevel {
    @PrimaryColumn()
    id: string;

	@Column()
	name?: string;

	@Column()
	avatar?: string;

    @Column()
    messages?: number;

	@Column()
    xp?: number;

	@Column({
		type: 'text',
		nullable: true
	})
    class?: string;

	@Column()
	level?: number;
}