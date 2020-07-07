import {Entity, Column, OneToMany, ManyToOne} from 'typeorm';
import Survey from './../Survey/entity';
import Answer from '../Answer/entity';
import EntitySample from '../Sample/entity';
@Entity()
export default class Question extends EntitySample {

    @Column()
    query: string;

    @Column()
    helpText: string;

    @Column()
    optionOne: string;

    @Column()
    optionTwo: string;

    @ManyToOne(() => Survey, survey => survey.questions, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    survey: Survey;
    
    @OneToMany(() => Answer, answer => answer.question, { cascade: true })
    answers: Answer[];

}