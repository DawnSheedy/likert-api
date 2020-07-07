import BodyParser from 'body-parser';
import apiRoutes from '../api';
import { Router } from 'express';
import passport from 'passport';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { isCelebrate } from 'celebrate';

export default (app: Router): void => {
    /*
         TODO:
         error handling
         security
        */
    const logger = Container.get<Logger>('logger');

    app.get('/status', (req, res) => {
        res.status(200).end();
    });

    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    app.use(BodyParser.json());

    app.use(passport.initialize());

    app.use('/api', apiRoutes());

    app.use(async (err, req, res, next) => {
        if (isCelebrate(err)) {
            res.status(400);
            res.json({
                statusCode: 400,
                error: err.joi.message
            }).end();
            return;
        }
    
        next(err);
    });

    // Error Handling
    app.use(async (err, _req, res, next) => {
        logger.error(err);
        res.status(500).json({ statusCode: 500, error: err }).end();
        next();
    });
};
