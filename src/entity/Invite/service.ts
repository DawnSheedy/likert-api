import { Service } from 'typedi';
import Invite from './entity';
import Survey from '../Survey/entity';
import EntityServiceSample from '../Sample/service';
import UserInputSchemaSample from '../Sample/schema';

interface UserInputSchema extends UserInputSchemaSample {
    firstName: string;
    lastName: string;
    completed: boolean;
    survey: Survey;
}

@Service()
export default class InviteService extends EntityServiceSample<UserInputSchema, Invite> {

    entity = Invite;

    async create(responseInfo: UserInputSchema): Promise<Invite> {
        const invite = Invite.create(responseInfo);
        await invite.generateAccessCode();
        await invite.save();
        return invite;
    }
}