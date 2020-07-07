import { Router } from 'express';
import auth from './routes/auth';
import survey from './routes/surveys';
import response from './routes/response';
import invites from './routes/invites';
import questions from './routes/questions';

export default (): Router => {
    const app = Router();
    
    auth(app);
    survey(app);
    invites(app);
    questions(app);

    return app;
};