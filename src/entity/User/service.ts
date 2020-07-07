import { Service } from 'typedi';
import User from './entity';
import EntityServiceSample from '../Sample/service';
import UserInputSchemaSample from '../Sample/schema';

interface UserInput extends UserInputSchemaSample {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

@Service()
export default class UserService extends EntityServiceSample<UserInput, User> {

    entity = User;

    async create(credentials: UserInput): Promise<User> {
        const existingUser = await User.findOne({ email: credentials.email });

        if (existingUser) {
            return Promise.reject(new Error(`Email ${credentials.email} is already in use.`));
        }

        const user = User.create(credentials);

        user.setPassword(credentials.password);

        await user.save();

        return user;
    }
}