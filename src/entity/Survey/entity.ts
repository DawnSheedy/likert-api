import {Entity, Column, OneToMany} from 'typeorm';
import Question from './../Question/entity';
import Invite from '../Invite/entity';
import EntitySample from '../Sample/entity';

@Entity()
export default class Survey extends EntitySample {

    @Column()
    title: string;

    @Column()
    description: string;

    @OneToMany(() => Question, question => question.survey, { cascade: true })
    questions: Question[];

    @OneToMany(() => Invite, invite => invite.survey, { cascade: true })
    invites: Invite[];
}
