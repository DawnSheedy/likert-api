import { Service } from 'typedi';
import Survey from './entity';
import Question from './../Question/entity';
import EntityServiceSample from './../Sample/service';
import UserInputSchemaSample from '../Sample/schema';

interface UserInputSchema extends UserInputSchemaSample {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}

@Service()
export default class SurveyService extends EntityServiceSample<UserInputSchema, Survey> {
    entity = Survey;
}