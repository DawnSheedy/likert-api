import { Router } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';
import passport from 'passport';
import adminCheck from '../../middleware/adminCheck';
import Question from '../../../entity/Question/entity';
//import { Like } from 'typeorm';

const route = Router();

export default (api: Router): void => {
    const logger = Container.get<Logger>('logger');

    api.use('/questions', route);

    // Require admin authentication
    route.use(passport.authenticate('token', { session: false, failWithError: true }));
    route.use(adminCheck);

    /*
        GET /
        Return list of questions;
    */
    route.get('/', async (req, res) => {
        const surveys = await Question.find({});
        res.json(surveys);
    });

    logger.info('Invites: Root Endpoints Loaded.');
};