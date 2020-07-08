import { Service } from 'typedi';
import Answer from './entity';
import Question from '../Question/entity';
import Invite from '../Invite/entity';
import EntityServiceSample from '../Sample/service';
import UserInputSchemaSample from '../Sample/schema';

interface UserInputSchema extends UserInputSchemaSample {
    firstName: string;
    lastName: string;
    question: Question;
    invite: Invite;
}

@Service()
export default class AnswerService extends EntityServiceSample<UserInputSchema, Answer> {

    async create(info: UserInputSchema): Promise<Answer> {
        const exists = await Answer.findOne(info);
        if (exists) {
            return Promise.reject(new Error('Answer already exists'));
        }
        const object = await Answer.create(info);
        await object.save();
        return object;
    }

    entity = Answer;

}