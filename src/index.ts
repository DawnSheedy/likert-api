import 'reflect-metadata';
import {createConnection} from 'typeorm';
import logger from './loaders/winston';
import express from 'express';
import config from './config';

createConnection().then(async connection => {
    
    const app = express();

    await require ('./loaders').default(app);

    app.listen(config.port, err => {
        if (err) {
            logger.error(err);
            process.exit(1);
            return;
        }
        logger.info(`
        :) Server listening on port ${config.port}
        `);
    });

}).catch(error => console.log(error));
