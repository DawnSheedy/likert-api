import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import crypto from 'crypto';
import Survey from '../Survey/entity';
import Answer from '../Answer/entity';
import EntitySample from '../Sample/entity';

@Entity()
export default class Invite extends EntitySample {

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    accessCode: string;

    @Column({ default: false })
    completed: boolean;

    @ManyToOne(() => Survey, survey => survey.invites, { onDelete: 'CASCADE', eager: true })
    survey: Survey;

    @OneToMany(() => Answer, answer => answer.invite, { cascade: true, eager: true })
    answers: Answer[];

    public async generateAccessCode(): Promise<string> {
        this.accessCode = crypto.randomBytes(64).toString('hex');
        return this.accessCode;
    }
}
