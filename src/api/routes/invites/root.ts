import { Router } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';
import passport from 'passport';
import Invite from '../../../entity/Invite/entity';
//import { Like } from 'typeorm';

const route = Router();

export default (api: Router): void => {
    const logger = Container.get<Logger>('logger');

    api.use('/invites', route);

    // Require authentication to access
    route.use(passport.authenticate(['token', 'response-auth'], {session: false, failWithError: true}));

    /*
        GET /
        Return list of invites;
        OR
        if an accessCode is provided, respond with invite id
    */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    route.get('/', async (req: any, res) => {
        if (req.user.accessCode) {
            const surveys = await Invite.findOne({ where: { accessCode: req.user.accessCode }});
            res.json(surveys);
        }
        const surveys = await Invite.find({});
        res.json(surveys);
    });

    logger.info('Invites: Root Endpoints Loaded.');
};