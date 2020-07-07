import { Service } from 'typedi';
import Question from './entity';
import Survey from './../Survey/entity';
import EntityServiceSample from '../Sample/service';
import UserInputSchemaSample from '../Sample/schema';

interface UserInputSchema extends UserInputSchemaSample {
    query: string;
    helpText: string;
    optionOne: string;
    optionTwo: string;
    survey: Survey;
}

@Service()
export default class QuestionService extends EntityServiceSample<UserInputSchema, Question> {
    entity = Question;
}