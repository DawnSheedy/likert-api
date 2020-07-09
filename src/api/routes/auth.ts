import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Segments, Joi } from 'celebrate';
import UserService from './../../entity/User/service';
import { Logger } from 'winston';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from './../../config';

const route = Router();

export default (api:Router): void => {
    const logger = Container.get<Logger>('logger');

    api.use('/auth', route);

    /*
        Register a user.
        Being a registered user grants you nothing. Unless verified and made an admin.
    */
    route.put('/register',
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required()
            }),
        }),async (req, res) => {
            logger.info('Registration Request');
            const userService = Container.get(UserService);

            await userService.create(req.body)
                .then((user) => {
                    res.send({ id: user.id });
                })
                .catch((err) => {
                    res.status(403).json(err);
                });
        });

    /*
        Generate JWT from username password.
    */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    route.post('/token', passport.authenticate('local', {session: false, failWithError: true}), async (req: any, res: any) => {
        if (!req.user) {
            res.sendStatus(403);
        }
        const body = { id: req.user.id, email: req.user.email };
        const token = jwt.sign({ user: body }, config.secret);

        res.json({ access_token: token });
    });

    logger.info('Loaded auth api.');
};