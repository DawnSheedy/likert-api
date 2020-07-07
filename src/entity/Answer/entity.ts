import {Entity, Column, ManyToOne} from 'typeorm';
import Question from './../Question/entity';
import Invite from '../Invite/entity';
import EntitySample from '../Sample/entity';

@Entity()
export default class Answer extends EntitySample {

    @Column()
    input: number;

    @ManyToOne(() => Question, question => question.answers, {onDelete: 'CASCADE'})
    question: Question;

    @ManyToOne(() => Invite, response => response.answers, { onDelete: 'CASCADE' })
    invite: Invite;
}
