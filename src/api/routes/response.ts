import { Router } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';
import passport from 'passport';

const route = Router();

export default (api: Router): void => {
    const logger = Container.get<Logger>('logger');
    //const surveyService = Container.get(SurveyService);

    api.use('/survey-response', route);

    route.use(passport.authenticate('response-auth', {session: false}));

    route.get('/', async (req, res) => {
        res.status(200).json(req.user);
    });

    logger.info('Loaded response api.');
};